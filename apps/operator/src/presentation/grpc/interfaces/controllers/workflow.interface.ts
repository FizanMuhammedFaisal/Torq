import type { HandlerContext } from '@connectrpc/connect';
import type { TriggerWorkflowRunRequest, TriggerWorkflowRunResponse } from '@torq-system/grpc';

export interface IWorkflowRunController {
	triggerRun(
		request: TriggerWorkflowRunRequest,
		context: HandlerContext,
	): Promise<TriggerWorkflowRunResponse>;
}
