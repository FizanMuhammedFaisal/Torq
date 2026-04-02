

export const RunStatus = {
	PENDING: 'PENDING',
	RUNNING: 'RUNNING',
	SUCCESS: 'SUCCESS',
	FAILED: 'FAILED',
	IDLE: 'IDLE',
} as const
export type RunStatus = typeof RunStatus[keyof typeof RunStatus];

export const TriggerType = {
	MANUAL: 'MANUAL',
	WEBHOOK: 'WEBHOOK',
	SCHEDULE: 'SCHEDULE',
} as const

export type TriggerType = typeof TriggerType[keyof typeof TriggerType];

export class WorkflowRun {
	constructor(
		public readonly id: string,
		public readonly workflowId: string,
		public readonly workflowVersionId: string,
		public readonly status: RunStatus,
		public readonly triggerType: TriggerType,
		public readonly triggeredBy: string,
		public readonly startedAt: Date,
		public readonly completedAt: Date | null,
		public readonly duration: number | null,
	) { }

	static create(props: {
		id: string;
		workflowId: string;
		workflowVersionId: string;
		status: WorkflowRunStatus;
		triggerType: WorkflowTriggerType;
		triggeredBy: string;
		startedAt: Date;
		completedAt: Date | null;
		duration: number | null;
	}) {
		return new WorkflowRun(
			props.id,
			props.workflowId,
			props.workflowVersionId,
			props.status,
			props.triggerType,
			props.triggeredBy,
			props.startedAt,
			props.completedAt,
			props.duration,
		);
	}
}
