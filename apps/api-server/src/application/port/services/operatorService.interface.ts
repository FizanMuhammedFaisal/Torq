/**
 * Application port for the Operator service.
 * plain TypeScript 
 */

export interface TriggerWorkflowRunParams {
    workflowId: string;
    spec: string;
}

export interface IOperatorService {
    triggerWorkflowRun(params: TriggerWorkflowRunParams): Promise<void>;
}
