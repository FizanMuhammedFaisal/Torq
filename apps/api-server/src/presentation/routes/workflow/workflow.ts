import Elysia from 'elysia';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowController } from '@/presentation/interfaces/controller/workflow.interface';
import type { Router } from '@/presentation/interfaces/routes';
import { CreateWorkflowSchema } from '@/application/dto/worflows/createWorkflow.dto';

@injectable()
export class WorkflowRouter implements Router {
	readonly prefix = '/workflows' as const;

	constructor(
		@inject(TOKENS.WorkflowController)
		private workflowController: IWorkflowController,
	) { }

	register() {
		return new Elysia({ prefix: this.prefix })
			.use(this.create())
			.use(this.list())
	}
	create() {
		return new Elysia().post('/', (ctx) =>
			this.workflowController.createWorkflow(ctx), {
			body: CreateWorkflowSchema
		}
		);
	}
	list() {
		return new Elysia().get('/', (ctx) => {
			return this.workflowController.getWorkflows(ctx)
		})
	}
}
