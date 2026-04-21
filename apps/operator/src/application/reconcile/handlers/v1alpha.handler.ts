import type { IReconciliationHandler } from '@/application/port/reconciler/reconciliationHandler.interface';
import type { ISpecRepository } from '@/application/port/repository/spec.interface';
import type { IWorkflowRunRepository } from '@/application/port/repository/workflowRun.interface';
import type { IJobService } from '@/application/port/services/jobService.interface';
import type { IWorkflowRunStatusRepository } from '@/application/port/repository/workflowRunStatus.interface';
import type { WorkflowSpec } from '@/domain/entities/workflowSpec';
import type { WorkflowRunSnapshot, RunPhase, StepState } from '@/domain/entities/WorkflowRunSnapshot';
import type { IPublisher } from '@/application/port/messageBroker/publisher.interface';
import { V1AlphaTorqJob, type V1AlphaSteps } from '@/domain/entities/job/v1alpha.job';
import { TOKENS } from '@/config/di/tokens';
import { logger } from '@/infrastructure/logger/logger';
import { inject, injectable } from 'tsyringe';
import { topoSort } from '@/domain/dsl/common/topoSort';

//  V1Alpha DSL types (mirrors api-server/src/domain/dsl/versions/v1alpha)
// The API server's DSL pipeline validates this shape before storage — we trust the contract.
interface Step { run: string }
interface JobSecretRef { name: string; env: string }
interface Job {
	image: string;
	needs?: string[];
	env?: Record<string, string>;
	secrets?: JobSecretRef[];
	steps: Step[];
}
interface WorkflowV1Alpha {
	version: string;
	workflow: string;
	jobs: Record<string, Job>;
}

@injectable()
export class V1AlphaReconciliationHandler implements IReconciliationHandler {
	constructor(
		@inject(TOKENS.SpecRepository) private specRepository: ISpecRepository,
		@inject(TOKENS.JobService) private jobService: IJobService,
		@inject(TOKENS.WorkflowRunStatusRepository) private statusRepository: IWorkflowRunStatusRepository,
		@inject(TOKENS.WorkflowRunRepository) private runRepository: IWorkflowRunRepository,
		@inject(TOKENS.RedisPublisher) private publisher: IPublisher,
	) { }

	// Called by JobWatcher when a managed K8s Job reaches a terminal state.
	async onJobComplete(params: {
		name: string;
		namespace: string;
		stepName: string;
		succeeded: boolean;
	}): Promise<void> {
		const { name, namespace, stepName, succeeded } = params;

		// Patch the step status on the CRD
		const stepState: StepState = {
			status: succeeded ? 'SUCCESS' : 'FAILED',
			completedAt: new Date().toISOString(),
			attempt: 1,
		};
		try {
			await this.statusRepository.patchStepStatus({ name, namespace, stepName, stepState });
		} catch (err) {
			// Don't short-circuit — still attempt reconcile so the DAG doesn't stall.
			// The CRD watch event will also fire a reconcile as a safety net.
			logger.error({ err, name, stepName }, '[v1alpha] Failed to patch step status in onJobComplete');
		}

		const result = await this.publisher.publish('workflow_run_states', {
			runName: name,
			stepName,
			status: stepState.status,
			ts: new Date().toISOString(),
		});

		if (!result.success) {
			logger.warn({ err: result.error, runName: name, stepName }, '[v1alpha] step event publish failed — client may see delayed status');
		}

		// Re-fetch the fresh WorkflowRun
		// The CRD now has the updated step status from Step 1.
		let freshRun: WorkflowRunSnapshot;
		try {
			freshRun = await this.runRepository.get(name, namespace);
		} catch (err) {
			logger.error({ err, name }, '[v1alpha] Failed to re-fetch WorkflowRun after job completion');
			return; // The CRD watch event will retry
		}

		// continue the reconcilation
		logger.info({ name, stepName, succeeded }, '[v1alpha] Job complete, driving DAG forward');
		// await this.reconcile(freshRun);
	}

	async reconcile(run: WorkflowRunSnapshot): Promise<void> {
		// if Run is already in a terminal phase then  nothing to do here
		const phase = run.status?.phase;
		if (phase === 'SUCCESS' || phase === 'FAILED' || phase === 'CANCELLED') {
			logger.debug(
				{ name: run.metadata.name, phase },
				'[v1alpha] Run already terminal, skipping reconcile',
			);
			return;
		}

		// Fetch workflow spec
		// A cache miss / gRPC error is transient — return without marking failed.
		// The next CRD MODIFIED event (from the jobwatcher or a re-list) will retry
		const spec = await this.specRepository.getSpec(run.spec.workflowId, run.spec.versionId);
		if (!spec) {
			logger.warn(
				{ workflowId: run.spec.workflowId, versionId: run.spec.versionId },
				'[v1alpha] Spec unavailable (cache miss / gRPC error), will retry on next event',
			);
			return;
		}

		// The API server DSL pipeline validates the spec at write time
		let workflowSpec: WorkflowV1Alpha;
		try {
			workflowSpec = this.castSpec(spec.spec);
		} catch (err) {
			logger.error({ err, name: run.metadata.name }, '[v1alpha] Spec cast failed, marking run as Failed');
			await this.failRun(run, `Invalid spec structure: ${(err as Error).message}`);
			return;
		}

		//  Topological sort
		// Cycles / unknown deps were caught by the API server semantic validator, still retry hrer
		let waves: string[][];
		try {
			waves = topoSort(workflowSpec.jobs);
		} catch (err) {
			logger.error({ err, name: run.metadata.name }, '[v1alpha] DAG error, marking run as Failed');
			await this.failRun(run, `DAG error: ${(err as Error).message}`);
			return;
		}

		console.log(waves)
		const stepStates: Record<string, StepState> = { ...(run.status?.steps ?? {}) };

		// Main scheduling loop (wave-by-wave, jobs within a wave run in parallel)
		let anyActive = false; // true if any job is Scheduled or Running
		let anyFailed = false; // true if any job has Failed this pass

		for (const wave of waves) {
			for (const jobName of wave) {
				const job = workflowSpec.jobs[jobName];
				const state = stepStates[jobName];

				// Already completed successfully
				if (state?.status === 'SUCCESS') continue;

				// Already failed — record and move on (no failFast in v1alpha)
				if (state?.status === 'FAILED') {
					anyFailed = true;
					continue;
				}

				// In flight from a previous reconcile pass
				if (state?.status === 'SCHEDULED' || state?.status === 'RUNNING') {
					anyActive = true;
					continue;
				}

				// Dependencies not yet satisfied — skip; we'll pick this up on the
				// next reconcile triggered by the dependency's job-completion event
				const needsMet = (job.needs ?? []).every(
					(dep) => stepStates[dep]?.status === 'SUCCESS',
				);
				if (!needsMet) continue;

				//  Schedule the K8s Job 
				const torqJob = this.buildTorqJob(run, jobName, job, spec);
				console.log("torqJob")
				console.log(torqJob)
				try {
					const { created } = await this.jobService.createJob(torqJob);
					if (created) {
						logger.info({ jobName, runName: run.metadata.name }, '[v1alpha] Job scheduled');
						stepStates[jobName] = {
							status: 'SCHEDULED',
							attempt: (state?.attempt ?? 0) + 1,
						};

						await this.publisher.publish('workflow_run_states', {
							runName: run.metadata.name,
							stepName: jobName,
							status: 'SCHEDULED',
							ts: new Date().toISOString(),
						});
					} else {
						// 409 — job already exists (operator restart / duplicate event)
						logger.debug({ jobName }, '[v1alpha] Job already existed, treating as active');
					}
					anyActive = true;
				} catch (err) {
					// K8s API error (422, 5xx, network) — mark step failed and continue
					// scheduling other independent branches
					logger.error({ err, jobName, runName: run.metadata.name }, '[v1alpha] K8s Job creation failed');
					stepStates[jobName] = {
						status: 'FAILED',
						completedAt: new Date().toISOString(),
						attempt: (state?.attempt ?? 0) + 1,
					};
					await this.publisher.publish('workflow_run_states', {
						runName: run.metadata.name,
						stepName: jobName,
						status: 'FAILED',
						ts: new Date().toISOString(),
					});
					anyFailed = true;
				}
			}
		}

		//  Compute the new overall run phase 
		const allJobNames = Object.keys(workflowSpec.jobs);
		const allSucceeded = allJobNames.every((n) => stepStates[n]?.status === 'SUCCESS');
		const allTerminal = allJobNames.every((n) =>
			['SUCCESS', 'FAILED'].includes(stepStates[n]?.status),
		);
		// Deadlocked: something failed, nothing is active, and not all steps done yet
		const deadlocked = anyFailed && !anyActive && !allTerminal;

		let newPhase: RunPhase = 'RUNNING';
		let completedAt: string | undefined;

		if (allSucceeded) {
			newPhase = 'SUCCESS';
			completedAt = new Date().toISOString();
		} else if (allTerminal || deadlocked) {
			// Either all finished (some failed) or we're stuck with no progress possible
			newPhase = 'FAILED';
			completedAt = new Date().toISOString();
		}

		//  Idempotency Check: Skip patching if status hasn't changed 
		const currentStatus = run.status;
		const statusChanged =
			!currentStatus ||
			currentStatus.phase !== newPhase ||
			JSON.stringify(currentStatus.steps) !== JSON.stringify(stepStates) ||
			currentStatus.observedGeneration !== run.metadata.generation;

		if (!statusChanged) {
			logger.debug({ name: run.metadata.name }, '[v1alpha] No status changes detected, skipping patch');
			return;
		}

		// Patch the CRD status subresource 
		// Failures here are non-fatal — the next watcher event will re-run reconcile.
		try {
			await this.statusRepository.patchStatus({
				name: run.metadata.name,
				namespace: run.metadata.namespace,
				phase: newPhase,
				steps: stepStates,
				// Set startedAt on the first time we transition out of Pending
				startedAt: run.status?.startedAt ?? new Date().toISOString(),
				completedAt,
				observedGeneration: run.metadata.generation,
			});

			await this.publisher.publish('workflow_run_states', {
				runName: run.metadata.name,
				status: newPhase,
				ts: new Date().toISOString(),
			});
		} catch (err) {
			logger.error(
				{ err, name: run.metadata.name },
				'[v1alpha] Failed to patch WorkflowRun status — will retry on next event',
			);
		}
	}

	/**
	 * Type cast for workflowv1alpha , since already. handled in the api server
	 */
	private castSpec(raw: Record<string, unknown>): WorkflowV1Alpha {
		if (typeof raw.jobs !== 'object' || raw.jobs === null) {
			throw new Error('Spec is missing the required "jobs" field');
		}
		return raw as unknown as WorkflowV1Alpha;
	}


	/**
	 * Build a TorqJob domain entity from the DSL job definition.
	 * Secret values from WorkflowSpec.secrets are merged directly into envs
	 * (v1alpha injects them as plain env vars — no K8s Secret objects needed).
	 */
	private buildTorqJob(
		run: WorkflowRunSnapshot,
		jobName: string,
		job: Job,
		spec: WorkflowSpec,
	): V1AlphaTorqJob {
		// Start from the job's own env map
		const envs: Record<string, string> = { ...(job.env ?? {}) };

		// Inject secret values under the env var name specified in the DSL
		for (const secretRef of job.secrets ?? []) {
			const secretValue = spec.secrets.find((s) => s.name === secretRef.name);
			if (secretValue) {
				envs[secretRef.env] = secretValue.value;
			} else {
				logger.warn(
					{ jobName, secretName: secretRef.name },
					'[v1alpha] Secret referenced in DSL not found in WorkflowSpec.secrets — skipping injection',
				);
			}
		}
		console.log("run")
		console.log(run)
		return new V1AlphaTorqJob(
			jobName,             // id — the step/job name, unique within this run
			run.spec.workflowRunId,    // workflowRunId — K8s UID, used as the log-stream key
			run.metadata.name,   // workflowRunName — CRD name, used by JobWatcher to patch status
			run.spec.workflowId,
			run.spec.versionId,
			run.spec.torqVersion,
			run.spec.triggeredBy, // identityId
			job.image,
			job.steps.map((s, i) => ({ index: i, run: s.run })),
			job.needs ?? [],
			envs,
			[],                  // secrets already merged into envs above
			run.metadata.namespace,
		);
	}


	private async failRun(run: WorkflowRunSnapshot, reason: string): Promise<void> {
		try {
			await this.statusRepository.patchStatus({
				name: run.metadata.name,
				namespace: run.metadata.namespace,
				phase: 'FAILED',
				steps: run.status?.steps ?? {},
				completedAt: new Date().toISOString(),
				reason,
				observedGeneration: run.metadata.generation,
			});

			await this.publisher.publish('workflow_run_states', {
				runName: run.metadata.name,
				status: 'FAILED',
				reason,
				ts: new Date().toISOString(),
			});
		} catch (err) {
			logger.error({ err, name: run.metadata.name, reason }, '[v1alpha] Could not patch run to Failed');
		}
	}

}
