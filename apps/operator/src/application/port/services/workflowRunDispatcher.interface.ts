import type { WorkflowRun } from '@/domain/entities/workflowRun';

export interface IWorkflowRunDispatcherService {
    create(run: WorkflowRun): Promise<void>
    // markSucceeded(run: WorkflowRun): Promise<void>
    // markFailed(run: WorkflowRun, reason: string): Promise<void>
}
