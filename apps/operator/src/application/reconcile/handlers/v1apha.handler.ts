import type { IReconciliationHandler } from '@/application/port/k8s/reconciliationHandler.interface';
import type { WorkflowRun } from '@/domain/entities/workflowRun';

export class V1AlphaReconciliationHandler implements IReconciliationHandler {
    reconcile(run: WorkflowRun): Promise<void> {
        throw new Error('Method not implemented.');
    }
    onJobComplete(runId: string, stepName: string, succeeded: boolean): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
