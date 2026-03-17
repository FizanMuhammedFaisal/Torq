export type WorkflowStatus =
	| 'idle'
	| 'queued'
	| 'running'
	| 'success'
	| 'failed';

export interface Workflow {
	id: string;
	name: string;
	description: string;
	status: WorkflowStatus;
	namespace: string;
	lastRun?: string;
	duration?: string;
	steps: number;
	successRate: boolean[]; // true = success, false = failure (for sparkline)
}
