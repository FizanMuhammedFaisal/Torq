import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';
import type { IReconciler } from '../port/reconciler/reconciler.interface';
import { logger } from '@/infrastructure/logger/logger';
import { inject } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { ICleanUpService } from '../port/services/cleanUp.inerface';
/**
 * The root reconciler refer Loop1 from core.md
 * this loop does not throw error it handle exeptions gracefully
 * unexpected cases willl be hanlded via marking unsucessfull and auditing to db
 */
export class Reconciler implements IReconciler {
    constructor(@inject(TOKENS.CleanupService) private cleanupService: ICleanUpService) { }
    reconcile(run: WorkflowRunSnapshot): Promise<void> {
        try {
            logger.trace({ run: run });
            // if deleted delegat to cleanup hanlder

            // if marked as end of lifecycle return

            // check hanlder if not supprted hanlde it via marking unsupprted
        } catch (error) { }
    }
}
