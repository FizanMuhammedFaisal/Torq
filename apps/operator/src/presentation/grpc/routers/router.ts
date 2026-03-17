import { injectable } from 'tsyringe';
import type { IRPCRouter } from '../interfaces/router.interface';
import type { ConnectRouter } from '@connectrpc/connect';
import { GetWorkflowsResponseSchema, WorkflowService } from '@torq-system/grpc';
import { create } from '@bufbuild/protobuf';

@injectable()
export class RPCRouter implements IRPCRouter {
	constructor() { }

	public register(router: ConnectRouter): void {
		// Tag routes
		router.service(WorkflowService, {
			getWorkflows: (req, context) => {
				return create(GetWorkflowsResponseSchema, {
					workflows: []
				})
			}
		});
	}
}
