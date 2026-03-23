import type { WorkflowRun } from '@/domain/entities/workflowRun';

// every versions hanlder must implement this
export interface IReconciliationHandler {
    reconcile(run: WorkflowRun): Promise<void>;
    onJobComplete(runId: string, stepName: string, succeeded: boolean): Promise<void>;
}
