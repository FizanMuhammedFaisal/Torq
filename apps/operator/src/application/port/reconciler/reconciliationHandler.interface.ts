import type { WorkflowRunSnapshot } from '@/domain/entities/workflowRunSnapshot';

// every versions hanlder must implement this
export interface IReconciliationHandler {
	reconcile(run: WorkflowRunSnapshot): Promise<void>;
}
