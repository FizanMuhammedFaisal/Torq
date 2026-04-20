import type { WorkflowRunSnapshot } from '@/domain/entities/workflowRunSnapshot';
import type { IReconciler } from '../port/reconciler/reconciler.interface';
import type { ICleanUpService } from '../port/services/cleanUp.inerface';
import type { IReconcilerVersionRouter } from '../port/reconciler/versionRouter.interface';
import type { IWorkflowRunStatusRepository } from '../port/repository/workflowRunStatus.interface';
import type { IPublisher } from '@/application/port/messageBroker/publisher.interface';
import { logger } from '@/infrastructure/logger/logger';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';

/**
 * The root reconciler refer Loop1 from core.md
 * this loop does not throw error it handle exeptions gracefully
 * unexpected cases willl be hanlded via marking unsucessfull and auditing to db

 * Dispatches to the correct version handler and handles cross-cutting concerns:
 *   - deletion / cleanup routing
 *   - unsupported version detection
 */
@injectable()
export class Reconciler implements IReconciler {
	constructor(
		@inject(TOKENS.CleanupService) private cleanupService: ICleanUpService,
		@inject(TOKENS.ReconcilerVersionRouter) private router: IReconcilerVersionRouter,
		@inject(TOKENS.WorkflowRunStatusRepository) private statusRepository: IWorkflowRunStatusRepository,
		@inject(TOKENS.RedisPublisher) private publisher: IPublisher,
	) { }

	async reconcile(run: WorkflowRunSnapshot): Promise<void> {
		try {
			logger.trace({ runName: run.metadata.name }, '[reconciler] received event');

			//if it have deltetedTimespam
			if (run.metadata.deletionTimestamp) {
				logger.info({ runName: run.metadata.name }, '[reconciler] run scheduled for deletion, cleaning up');
				await this.cleanupService.handle(run);
				return;
			}

			// Resolve the version handler
			const handler = this.router.resolve(run.spec.torqVersion);
			if (!handler) {
				logger.error(
					{ torqVersion: run.spec.torqVersion, supported: this.router.supported() },
					'[reconciler] unsupported torqVersion',
				);
				await this.markUnsupportedVersion(run);
				return;
			}

			await handler.reconcile(run);
		} catch (err) {
			// This catch should never fire in normal operation
			//  version handlers are expected to handle their own errors. If something slips through,
			// log it and patch the run to Failed so it doesn't hang in Pending.
			logger.error({ err, runName: run.metadata.name }, '[reconciler] unexpected error during reconcile');
			try {
				await this.statusRepository.patchStatus({
					name: run.metadata.name,
					namespace: run.metadata.namespace,
					phase: 'FAILED',
					steps: run.status?.steps ?? {},
					completedAt: new Date().toISOString(),
					reason: 'Internal Runner error',
					observedGeneration: run.metadata.generation,
				});
				const result = await this.publisher.publish('workflow_run_states', {
					runName: run.metadata.name,
					status: 'FAILED',
					reason: 'Internal Runner Error',
					ts: new Date().toISOString(),
				});
				if (!result.success) {
					logger.warn({ err: result.error, runName: run.metadata.name }, '[reconciler] publish failed after unexpected error');
				}
			} catch (patchErr) {
				logger.error({ patchErr, runName: run.metadata.name }, '[reconciler] could not patch run to Failed after unexpected error');
			}
		}
	}

	/**
	 * Mark a run as Failed with a clear reason when no handler is supported
	 * 
	 */
	private async markUnsupportedVersion(run: WorkflowRunSnapshot): Promise<void> {
		const reason = `Unsupported torqVersion "${run.spec.torqVersion}". Supported: ${this.router.supported().join(', ')}`;
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
			const result = await this.publisher.publish('workflow_run_states', {
				runName: run.metadata.name,
				status: 'FAILED',
				reason,
				ts: new Date().toISOString(),
			});
			if (!result.success) {
				logger.warn({ err: result.error, runName: run.metadata.name }, '[reconciler] publish failed after marking unsupported version');
			}
		} catch (err) {
			logger.error({ err, runName: run.metadata.name, reason }, '[reconciler] failed to mark unsupported version');
		}
	}
}
