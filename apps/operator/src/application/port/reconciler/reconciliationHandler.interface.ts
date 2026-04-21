import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';

// every versions hanlder must implement this
export interface IReconciliationHandler {
	// Schedule jobs for whichever steps are unblocked right now 
	reconcile(run: WorkflowRunSnapshot): Promise<void>;

	onJobComplete(params: {
		name: string;
		namespace: string;
		stepName: string;
		succeeded: boolean;
	}): Promise<void>;
}
