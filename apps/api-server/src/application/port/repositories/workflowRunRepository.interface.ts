import z from 'zod';

export const RUN_STATUS = {
	RUNNING: 'running',
	SUCCESS: 'success',
	FAILED: 'failed',
	IDLE: 'idle',
} as const;

export const TRIGGER_TYPE = {
	MANUAL: 'manual',
	WEBHOOK: 'webhook',
	SCHEDULE: 'schedule',
} as const;

export const RunStatusSchema = z.enum(['running', 'success', 'failed', 'idle']);
export type RunStatus = z.infer<typeof RunStatusSchema>;

export const TriggerTypeSchema = z.enum(['manual', 'webhook', 'schedule']);
export type TriggerType = z.infer<typeof TriggerTypeSchema>;

export type PersistRunDto = {
	status: RunStatus;
	startedAt?: string;
	completedAt?: string | null;
	duration?: number | null;
	steps: number;
	workflowId: string;
	workflowVersionId: string;
	identityId: string;
	triggerType: TriggerType;
	triggeredBy: string;
};

export type PersistedRunDto = {
	id: string;
	workflowId: string;
	workflowVersionId: string;
	status: RunStatus;
	triggerType: TriggerType;
	triggeredBy: string;
	startedAt: Date;
	completedAt: Date | null;
	duration: number | null;
	steps: number;
};

export interface IWorkflowRunRepository {
	createRun(data: PersistRunDto): Promise<PersistedRunDto>;
	updateRunStatus(id: string, status: RunStatus): Promise<void>;
}
