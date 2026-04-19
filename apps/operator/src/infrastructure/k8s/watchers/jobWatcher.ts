import { inject, injectable } from 'tsyringe';
import * as k8s from '@kubernetes/client-node';
import { kubeConfig } from '../client';
import { Envconfig } from '@/config/envconfig';
import { logger } from '@/infrastructure/logger/logger';
import { BaseWatcher } from './baseWatcher';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowRunStatusRepository } from '@/application/port/repository/workflowRunStatus.interface';
import type { StepState } from '@/domain/entities/workflowRunSnapshot';

/**
 * Loop 2 === watches K8s Jobs created by the operator (label managed-by=torq)
 *
 * When a job transitions to Complete or Failed, this watcher patches the
 * corresponding step in the WorkflowRun CRD's status subresource.
 * That patch fires a new CRD MODIFIED event → CRDWatcher → Reconciler re-runs,
 * which then schedules the next wave of jobs (or marks the run terminal).
 *
 * JobWatcher intentionally does NOT call the reconciler directly — the CRD
 * status is the single source of truth and the event is the trigger.
 */
@injectable()
export class JobWatcher extends BaseWatcher {
	private readonly watch = new k8s.Watch(kubeConfig);

	constructor(
		@inject(TOKENS.WorkflowRunStatusRepository)
		private statusRepo: IWorkflowRunStatusRepository,
	) {
		super();
	}

	async startWatch(): Promise<void> {
		const namespace = Envconfig.k8s.namespace;
		const path = `/apis/batch/v1/namespaces/${namespace}/jobs`;

		logger.info({ path }, '[job-watcher] starting watch');

		this.watch.watch(
			path,
			{
				labelSelector: 'app.kubernetes.io/managed-by=torq',
				...(this.lastResourceVersion ? { resourceVersion: this.lastResourceVersion } : {}),
			},
			this.handler.bind(this),
			this.hanldeDisconnect.bind(this),
		);
	}

	private async handler(phase: string, job: k8s.V1Job): Promise<void> {
		// Track cursor for reconnect resume
		if (job.metadata?.resourceVersion) {
			this.lastResourceVersion = job.metadata.resourceVersion;
		}

		// Only care about state changes — ADDED fires when the Job is first created
		// (still running at that point), DELETED is after TTL cleanup
		if (phase !== 'MODIFIED') return;

		const conditions = job.status?.conditions ?? [];
		const isComplete = conditions.some((c) => c.type === 'Complete' && c.status === 'True');
		const isFailed = conditions.some((c) => c.type === 'Failed' && c.status === 'True');

		// Job is still in progress — ignore this event
		if (!isComplete && !isFailed) return;

		const workflowRunName = job.metadata?.labels?.['torq/workflow-run-name'];
		const stepName = job.metadata?.labels?.['torq/job-id'];
		const namespace = job.metadata?.namespace ?? Envconfig.k8s.namespace;
		const jobName = job.metadata?.name;

		if (!workflowRunName || !stepName) {
			logger.warn(
				{ jobName },
				'[job-watcher] Job completed but is missing torq labels — cannot update WorkflowRun status',
			);
			return;
		}

		const stepState: StepState = {
			status: isComplete ? 'Succeeded' : 'Failed',
			completedAt: new Date().toISOString(),
			attempt: 1, // JobWatcher doesn't track retries — handler sets attempt on creation
		};

		try {
			await this.statusRepo.patchStepStatus({
				name: workflowRunName,
				namespace,
				stepName,
				stepState,
			});
			logger.info(
				{ workflowRunName, stepName, status: stepState.status },
				'[job-watcher] Step status patched — reconciler will pick up the next wave',
			);
		} catch (err) {
			// Non-fatal: the next job MODIFIED event (or a re-list) will retry
			logger.error(
				{ err, workflowRunName, stepName },
				'[job-watcher] Failed to patch step status',
			);
		}
	}
}
