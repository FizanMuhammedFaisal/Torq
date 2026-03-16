export type WorkflowRunStatus = 'running' | 'success' | 'failed' | 'idle';

export interface GetWorkflowsInputDto {
	req: { id: string };
}

export interface WorkflowRunSummary {
	status: WorkflowRunStatus;
	startedAt: Date;
	completedAt: Date | null;
	duration: number | null;
	steps: number;
}

export interface GetWorkflowsOutputDto {
	workflows: {
		id: string;
		name: string;
		description: string | undefined;
		createdAt: Date;
		/** true = success, false = failed, undefined = running */
		health: (boolean | null)[];
		lastRun: WorkflowRunSummary | null;
		status: WorkflowRunStatus;
	}[];
}
