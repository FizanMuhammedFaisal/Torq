import { inject, injectable } from 'tsyringe';
import * as k8s from '@kubernetes/client-node';
import { kubeConfig } from '../client';
import { Envconfig } from '@/config/envconfig';
import { logger } from '@/infrastructure/logger/logger';
import { BaseWatcher } from './baseWatcher';
import { TOKENS } from '@/config/di/tokens';
import type { IReconcilerVersionRouter } from '@/application/port/reconciler/versionRouter.interface';

/**
 * Loop 2 === watches K8s Jobs created by the operator (label managed-by=torq)
 *
 * When a job transitions to Complete or Failed, this watcher:
 *  1. reads the torq/version label to route to the correct version handler
 *  2. calls handler.onJobComplete() which:
 *       - patches the step status on the CRD
 *       - calls reconcile(freshRun) directly to schedule the next wave
 */
@injectable()
export class JobWatcher extends BaseWatcher {
	private readonly watch = new k8s.Watch(kubeConfig);

	constructor(
		@inject(TOKENS.ReconcilerVersionRouter)
		private versionRouter: IReconcilerVersionRouter,
	) {
		super();
	}

	async startWatch(): Promise<void> {
		const namespace = Envconfig.k8s.namespace;
		const path = `/apis/batch/v1/namespaces/${namespace}/jobs`;

		logger.info({ path }, '[job-watcher] starting watch');
		this.markWatchStarted();

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
		logger.info({
			messsage: "[Job-watcher] Reached",
			job,
			phase
		})
		if (job.metadata?.resourceVersion) {
			this.lastResourceVersion = job.metadata.resourceVersion;
		}

		// Only care about state changes and existing terminal states
		if (phase !== 'MODIFIED' && phase !== 'ADDED') return;

		// Terminal detection via status counters
		// K8s updates these atomically; conditions can lag in some edge cases.
		const active = job.status?.active ?? 0;
		const succeeded = job.status?.succeeded ?? 0;
		const failed = job.status?.failed ?? 0;

		// Job is still running
		if (active > 0) return;

		// Not started yet or no meaningful change
		if (succeeded === 0 && failed === 0) return;

		const isSucceeded = succeeded > 0;

		// Extract routing labels
		const labels = job.metadata?.labels ?? {};
		const workflowRunName = labels['torq/workflow-run-name'];
		const stepName = labels['torq/job-id'];
		const torqVersion = labels['torq/version'];
		const namespace = job.metadata?.namespace ?? Envconfig.k8s.namespace;
		const jobName = job.metadata?.name;

		if (!workflowRunName || !stepName || !torqVersion) {
			logger.warn(
				{ jobName, labels },
				'[job-watcher] Job terminal but missing torq labels — cannot update WorkflowRun',
			);
			return;
		}

		const handler = this.versionRouter.resolve(torqVersion);
		if (!handler) {
			logger.error(
				{ jobName, torqVersion },
				'[job-watcher] No handler found for torqVersion — skipping',
			);
			return;
		}

		logger.info(
			{ jobName, workflowRunName, stepName, isSucceeded },
			'[job-watcher] Job terminal, invoking handler.onJobComplete',
		);

		try {
			await handler.onJobComplete({
				name: workflowRunName,
				namespace,
				stepName,
				succeeded: isSucceeded,
			});
		} catch (err) {
			// Non-fatal: the CRD MODIFIED event triggered by the status patch will
			// drive a reconcile pass as a safety net.
			logger.error(
				{ err, workflowRunName, stepName },
				'[job-watcher] handler.onJobComplete threw — will retry via CRD watch event',
			);
		}
	}
}
