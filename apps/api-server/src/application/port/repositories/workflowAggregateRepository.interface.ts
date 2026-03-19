import type { WorkflowWithLatestRun } from '@/domain/entities/workflowWithLatestRun';

/**
 * repository for retrieving composite aggregates (projections)
 * that combine workflows with their execution status.
 */
export interface IWorkflowAggregateRepository {
	findAllWithLatestRun(identityId: string): Promise<WorkflowWithLatestRun[]>;
	findByIdWithLatestRun(id: string): Promise<WorkflowWithLatestRun | null>;
}
