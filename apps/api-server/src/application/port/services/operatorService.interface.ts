import type { TriggerType } from '@domain/entities/workflowRun';

export interface TriggerWorkflowRunParams {
	workflowId: string;
	versionId: string;
	torqVersion: string;
	triggerType: TriggerType;
	workflowRunId: string;
}

export interface IOperatorService {
	triggerWorkflowRun(params: TriggerWorkflowRunParams): Promise<void>;
}
