import type { WorkflowSpec } from '@/domain/entities/workflowSpec';

export interface ISpecRepository {
	getSpec(id: string): Promise<WorkflowSpec | null>;
}
