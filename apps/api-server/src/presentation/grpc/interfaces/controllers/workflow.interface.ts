import type { HandlerContext } from '@connectrpc/connect';
import type { GetSpecRequest, GetSpecResponse } from '@torq-system/grpc/apiserver/workflowrun/v1';

export interface IWorkflowRPCController {
	getSpec(request: GetSpecRequest, context: HandlerContext): Promise<GetSpecResponse>;
}
