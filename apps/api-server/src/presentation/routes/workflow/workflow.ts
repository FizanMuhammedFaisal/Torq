import Elysia from 'elysia';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowController } from '@/presentation/interfaces/controller/workflow.interface';
import type { Router } from '@/presentation/interfaces/routes';
import { CreateWorkflowSchema } from '@/application/dto/worflows/createWorkflow.dto';
import type { AuthMacro } from '@/presentation/macros/auth.macro';

@injectable()
export class WorkflowRouter implements Router {
	readonly prefix = '/workflows';

	constructor(
		@inject(TOKENS.WorkflowController)
		private workflowController: IWorkflowController,
		@inject(TOKENS.AuthMacro)
		private authMacro: AuthMacro,
	) { }

	register() {
		return new Elysia({ prefix: this.prefix })

			.use(this.create())
			.use(this.list())
	}
	create() {
		return new Elysia()
			.use(this.authMacro.plugin()).post('/', (ctx) => {
				return this.workflowController.createWorkflow(ctx)
			}
				, {
					body: CreateWorkflowSchema,
					auth: true
				}
			);
	}
	list() {
		return new Elysia()
			.use(this.authMacro.plugin()).get('/', (ctx) => {
				return this.workflowController.getWorkflows(ctx)
			}, {
				auth: true
			})
	}
}
