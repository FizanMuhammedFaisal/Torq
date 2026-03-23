export type WorkflowRunStatus = 'pending' | 'running' | 'success' | 'failed' | 'idle';
export type WorkflowTriggerType = 'manual' | 'webhook' | 'schedule';

export const RUN_STATUS = {
	PENDING: 'pending',
	RUNNING: 'running',
	SUCCESS: 'success',
	FAILED: 'failed',
	IDLE: 'idle',
} as const satisfies Record<string, WorkflowRunStatus>;

export const TRIGGER_TYPE = {
	MANUAL: 'manual',
	WEBHOOK: 'webhook',
	SCHEDULE: 'schedule',
} as const satisfies Record<string, WorkflowTriggerType>;

export class WorkflowRun {
	constructor(
		public readonly id: string,
		public readonly workflowId: string,
		public readonly workflowVersionId: string,
		public readonly status: WorkflowRunStatus,
		public readonly triggerType: WorkflowTriggerType,
		public readonly startedAt: Date,
		public readonly completedAt: Date | null,
		public spec: Record<string, unknown>,
	) { }

	static create(props: {
		id: string;
		workflowId: string;
		workflowVersionId: string;
		status: WorkflowRunStatus;
		triggerType: WorkflowTriggerType;
		startedAt: Date;
		completedAt: Date | null;
		spec: Record<string, unknown>;
	}) {
		return new WorkflowRun(
			props.id,
			props.workflowId,
			props.workflowVersionId,
			props.status,
			props.triggerType,
			props.startedAt,
			props.completedAt,
			props.spec
		);
	}
}
