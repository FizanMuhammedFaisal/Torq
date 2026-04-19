import type { V1Job } from '@kubernetes/client-node';

export interface IJobRepository {
	// Submit a K8s Job manifest. Returns false when the job already exists (409 — idempotent).
	create(manifest: V1Job): Promise<{ created: boolean }>;

	// List all K8s Jobs owned by a WorkflowRun, identified by the torq/workflow-run-id label.
	listByRun(workflowRunId: string, namespace: string): Promise<V1Job[]>;
}
