import Elysia from 'elysia';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowController } from '@/presentation/interfaces/controller/workflow.interface';
import type { Router } from '@/presentation/interfaces/routes';

@injectable()
export class WorkflowRouter implements Router {
	readonly prefix = '/workflows' as const;

	constructor(
		@inject(TOKENS.WorkflowController)
		private workflowController: IWorkflowController,
	) { }

	register() {
		return new Elysia({ prefix: this.prefix }).get('/', (ctx) =>
			this.workflowController.getWorkflows(ctx),
		);
	}
}
