import type { Workflow } from '@/domain/entities/workflow';

export interface IWorkflowRunDispatcherService {
	create(run: Workflow): Promise<void>;
	// markSucceeded(run: WorkflowRun): Promise<void>
	// markFailed(run: WorkflowRun, reason: string): Promise<void>
}
