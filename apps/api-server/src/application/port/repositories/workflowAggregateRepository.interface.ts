import type { WorkflowWithLatestRun } from '@/domain/entities/aggregates/workflowWithLatestRun';

/**
 * repository for retrieving composite aggregates (projections)
 * that combine workflows with their execution status.
 */
export interface IWorkflowAggregateRepository {
	findAllWithLatestRun(
		identityId: string,
		limit: number,
		skip: number,
	): Promise<WorkflowWithLatestRun[]>;
	findByIdWithLatestRun(id: string): Promise<WorkflowWithLatestRun | null>;
	findCount(identityId: string): Promise<number>;
}
