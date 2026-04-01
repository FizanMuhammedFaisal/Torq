import type { Registry } from '../registry';

export const TriggerType = {
	MANUAL: 'MANUAL',
	WEBHOOK: 'WEBHOOK',
	SCHEDULE: 'SCHEDULE',
};
export type TriggerType = (typeof TriggerType)[keyof typeof TriggerType];
export class Workflow {
	private constructor(
		public readonly workflowId: string,
		public readonly versionId: string,
		public readonly torqVersion: Registry,
		public readonly triggerType: TriggerType,
		public readonly createdAt: Date,

	) { }

	static create({
		workflowId,
		versionId,
		torqVersion,
		createdAt,
		triggerType,
	}: {
		workflowId: string;
		versionId: string;
		torqVersion: Registry;
		triggerType: TriggerType;
		createdAt: Date;

	}) {
		return new Workflow(workflowId, versionId, torqVersion, triggerType, createdAt);
	}
}
