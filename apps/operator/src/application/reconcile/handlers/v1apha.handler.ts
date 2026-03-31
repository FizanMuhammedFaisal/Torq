import type { IReconciliationHandler } from '@/application/port/reconciler/reconciliationHandler.interface';
import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';

export class V1AlphaReconciliationHandler implements IReconciliationHandler {
    reconcile(run: WorkflowRunSnapshot): Promise<void> {
        // get the speac ffom api server
        // make secrect and schedule jobs 
    }
}
