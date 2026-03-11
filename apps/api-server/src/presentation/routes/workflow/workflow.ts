import Elysia from 'elysia';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowController } from '@/presentation/interfaces/controller/workflow.interface';
import type { Router } from '@/presentation/interfaces/routes';
import { CreateWorkflowSchema } from '@/application/dto/worflows/createWorkflow.dto';
import { UpsertSecretsSchema } from '@/application/dto/worflows/upsertSecrets.dto';
import type { ICreateWorkflowUseCase } from '@/application/port/usecases/workflows/createWorkflow.interface';
import type { IUpsertSecretsUseCase } from '@/application/port/usecases/workflows/upsertSecrets.interface';
import type { AuthMacro } from '@/presentation/macros/auth.macro';
import type { AuthenticatedContext } from '@/presentation/macros/auth.macro';

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
			.use(this.upsertSecrets())
			.use(this.getSecrets());
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
			});
	}

	upsertSecrets() {
		return new Elysia()
			.use(this.authMacro.plugin()).post('/:id/secrets', (ctx) => {
				return this.workflowController.upsertSecrets(ctx)
			}, {
				body: UpsertSecretsSchema,
				auth: true
			});
	}

	getSecrets() {
		return new Elysia()
			.use(this.authMacro.plugin()).get('/:id/secrets', (ctx) => {
				return this.workflowController.getSecrets(ctx)
			}, {
				auth: true
			});
	}
}
