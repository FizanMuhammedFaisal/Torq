import type { WorkflowRunSnapshot } from '@/domain/entities/workflowRunSnapshot';

export interface IReconciler {
	reconcile(run: WorkflowRunSnapshot): Promise<void>;
}
