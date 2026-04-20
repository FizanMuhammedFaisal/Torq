import type { WorkflowSpec } from '@/domain/entities/workflowSpec';

export interface ISpecRepository {
	getSpec(workflowId: string, versionId: string): Promise<WorkflowSpec | null>;
}
