import { inject, injectable } from 'tsyringe';
import type { IRPCRouter } from '../interfaces/router.interface';
import type { ConnectRouter } from '@connectrpc/connect';
import { OperatorService } from '@torq-system/grpc';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowRunController } from '../interfaces/controllers/workflow.interface';

@injectable()
export class RPCRouter implements IRPCRouter {
	constructor(
		@inject(TOKENS.IWorkflowRunController) private workflowRunController: IWorkflowRunController,
	) {}
	public register(router: ConnectRouter): void {
		router.service(OperatorService, {
			triggerWorkflowRun: (req, context) => this.workflowRunController.triggerRun(req, context),
		});
	}
}
