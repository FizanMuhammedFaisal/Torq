import { injectable } from 'tsyringe';
import type { IRPCRouter } from '../interfaces/router.interface';
import type { ConnectRouter } from '@connectrpc/connect';
import { OperatorService, TriggerWorkflowRunResponseSchema } from '@torq-system/grpc';
import { create } from '@bufbuild/protobuf';

@injectable()
export class RPCRouter implements IRPCRouter {
	public register(router: ConnectRouter): void {
		router.service(OperatorService, {
			triggerWorkflowRun: (req, context) => {
				console.log('Triggering workflow run:', req.workflowId);
				return create(TriggerWorkflowRunResponseSchema, {
					runId: 'mock-run-id',
				});
			},
		});
	}
}
