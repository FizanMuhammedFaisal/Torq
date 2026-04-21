import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';

export interface IWorkflowRunRepository {
	create(manifest: object): Promise<void>;
	// Fetch a WorkflowRun CRD by name and map it to the domain snapshot
	get(name: string, namespace: string): Promise<WorkflowRunSnapshot>;
}
