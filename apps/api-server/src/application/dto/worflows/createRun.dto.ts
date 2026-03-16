export type RunStatus = 'running' | 'success' | 'failed' | 'idle';

export interface CreateRunInputDto {
	workflowId: string;
	req: { id: string };
	status: RunStatus;
	startedAt?: string;
	completedAt?: string | null;
	duration?: number | null;
	steps: number;
}

export interface CreateRunOutputDto {
	id: string;
	workflowId: string;
	status: RunStatus;
	startedAt: Date;
	completedAt: Date | null;
	duration: number | null;
	steps: number;
}
