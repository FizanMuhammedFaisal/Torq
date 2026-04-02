import { inject, injectable } from 'tsyringe';
import type { IRPCRouter } from '../interfaces/router.interface';
import type { ConnectRouter } from '@connectrpc/connect';
import { TOKENS } from '@/config/di/tokens';
import { ApiServerService } from '@torq-system/grpc';
import { type IWorkflowRPCController } from '../interfaces/controllers/workflow.interface';


@injectable()
export class RPCRouter implements IRPCRouter {

	constructor(
		@inject(TOKENS.WorkflowController) private workflowController: IWorkflowRPCController

	) { }

	public register(router: ConnectRouter): void {
		router.service(ApiServerService, {
			getSpec: (req, context) => this.workflowController.triggerRun(req, context)
		})
	}
}
