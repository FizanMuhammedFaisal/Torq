import { HandlerContext } from '@connectrpc/connect';
import { GetSpecRequest, GetSpecResponse } from '@torq-system/grpc/apiserver/workflowrun/v1';

export interface IWorkflowRPCController {
	getSpec(request: GetSpecRequest, context: HandlerContext): Promise<GetSpecResponse>;
}
