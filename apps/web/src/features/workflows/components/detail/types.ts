export type WorkflowStatus = 'idle' | 'queued' | 'running' | 'success' | 'failed';

export interface Run {
	id: string;
	status: WorkflowStatus;
	trigger: string;
	date: string;
	duration: string;
	steps: { name: string; status: WorkflowStatus; duration: string }[];
}
