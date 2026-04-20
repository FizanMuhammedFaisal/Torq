import type { ICleanUpService } from '@/application/port/services/cleanUp.inerface';
import type { IWorkflowRunStatusRepository } from '@/application/port/repository/workflowRunStatus.interface';
import type { IJobRepository } from '@/application/port/repository/jobs.interface';
import type { IPublisher } from '@/application/port/messageBroker/publisher.interface';
import type { WorkflowRunSnapshot } from '@/domain/entities/workflowRunSnapshot';
import { logger } from '@/infrastructure/logger/logger';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';

const FINALIZER = 'torq.dev/cleanup';

/**
 * CleanUpService — called by the Reconciler when a WorkflowRun CRD is
 * marked for deletion (deletionTimestamp is set).
 *
 * What will this thing do ===
 *   1. List all K8s Jobs owned by this run (via label torq/workflow-run-id)
 *   2. If any jobs are still active, log a warning and bail — K8s will
 *      re-deliver the MODIFIED event so we'll check again shortly.
 *   3. Publish a terminal Redis event so the API server can finalize its
 *      read model.
 *   4. Remove the finalizer — this unblocks Kubernetes from deleting the CRD.
 */
@injectable()
export class CleanUpService implements ICleanUpService {
	constructor(
		@inject(TOKENS.WorkflowRunStatusRepository) private statusRepository: IWorkflowRunStatusRepository,
		@inject(TOKENS.JobRepository) private jobRepository: IJobRepository,
		@inject(TOKENS.RedisPublisher) private publisher: IPublisher,
	) { }

	async handle(run: WorkflowRunSnapshot): Promise<void> {
		const { name, namespace, uid } = run.metadata;

		// Check if any owned Jobs are still active
		try {
			const jobs = await this.jobRepository.listByRun(uid, namespace);
			const activeJobs = jobs.filter((j) => (j.status?.active ?? 0) > 0);

			if (activeJobs.length > 0) {
				logger.warn(
					{ runName: name, activeJobs: activeJobs.map((j) => j.metadata?.name) },
					'[cleanup] run marked for deletion but jobs still active — deferring finalizer removal',
				);
				// Don't remove the finalizer yet. The JobWatcher will call onJobComplete
				// when they finish, which triggers another MODIFIED event → cleanup retry.
				return;
			}
		} catch (err) {
			logger.error({ err, runName: name }, '[cleanup] failed to list K8s Jobs — deferring');
			return; // Retry on next event
		}

		// Publish terminal event to Redis
		const finalPhase = run.status?.phase ?? 'PENDING';
		const result = await this.publisher.publish('workflow_run_states', {
			runName: name,
			status: finalPhase,
			reason: 'WorkflowRun deleted',
			ts: new Date().toISOString(),
		});
		if (!result.success) {
			logger.warn({ err: result.error, runName: name }, '[cleanup] terminal event publish failed');
		}

		// Remove the finalizer -> allows Kubernetes to delete the CRD
		try {
			await this.statusRepository.removeFinalizer(name, namespace, FINALIZER);
			logger.info({ runName: name }, '[cleanup] finalizer removed — CRD deletion unblocked');
		} catch (err) {
			logger.error({ err, runName: name }, '[cleanup] failed to remove finalizer — Kubernetes will retry');
		}
	}
}
