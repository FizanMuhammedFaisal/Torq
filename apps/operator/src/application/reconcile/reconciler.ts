import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';
import type { IReconciler } from '../port/reconciler/reconciler.interface';
import { logger } from '@/infrastructure/logger/logger';
import { inject } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { ICleanUpService } from '../port/services/cleanUp.inerface';
import type { IReconcilerVersionRouter } from '../port/reconciler/versionRouter.interface';
/**
 * The root reconciler refer Loop1 from core.md
 * this loop does not throw error it handle exeptions gracefully
 * unexpected cases willl be hanlded via marking unsucessfull and auditing to db
 */
export class Reconciler implements IReconciler {
	constructor(
		@inject(TOKENS.CleanupService) private cleanupService: ICleanUpService,
		@inject(TOKENS.ReconcilerVersionRouter) private router: IReconcilerVersionRouter,
	) {}
	async reconcile(run: WorkflowRunSnapshot): Promise<void> {
		try {
			logger.trace({ run: run });
			// if deleted delegat to cleanup hanlder
			if (run.metadata.deletionTimestamp) {
				logger.trace(`WorkflowRun with ${run.metadata.uid} has been scheduled to be deleted`);
				await this.cleanupService.handle(run);
				return;
			}
			// if marked as end of lifecycle return
			const handler = this.router.resolve(run.spec.torqVersion);
			if (!handler) {
				logger.error(
					{
						torqVersion: run.spec.torqVersion,
						supported: this.router.supported(),
					},
					'unsupported torqVersion',
				);
				await this.markUnsupportedVersion(run);
				return;
			}
			await handler.reconcile(run);
			// check hanlder if not supprted hanlde it via marking unsupprted
		} catch (error) {}
	}
	private async markUnsupportedVersion(run: WorkflowRunSnapshot) {
		//makr on kuber as failed
		//update db as failed
		//update the message bus as failed
	}
}
