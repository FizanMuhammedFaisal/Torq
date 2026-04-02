
export type WorkflowStatus =
	| 'idle'
	| 'queued'
	| 'running'
	| 'success'
	| 'failed';


export type TriggerType = 'MANUAL' | 'WEBHOOK' | 'SCHEDULE';

export interface Workflow {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
}


export interface WorkflowRun {
	id: string;
	workflowId: string;
	workflowVersionId: string;
	status: WorkflowStatus;
	triggerType: TriggerType;
	triggeredBy: string;
	startedAt: string;
	completedAt: string | null;
	duration: number | null;
}


export interface WorkflowRunSummary {
	status: WorkflowStatus;
	startedAt: string;
	completedAt: string | null;
	duration: number | null;
}


export interface WorkflowWithLatestRun extends Workflow {
	health: (boolean | null)[];
	lastRun: WorkflowRunSummary | null;
}


export interface WorkflowSecret {
	id: string;
	workflowId: string;
	key: string;
	createdAt: string;
	updatedAt: string;
}