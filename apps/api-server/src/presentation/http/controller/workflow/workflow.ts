import { TOKENS } from '@/config/di/tokens';
import { inject, injectable } from 'tsyringe';
import type { IWorkflowController } from '@/presentation/http/interfaces/controller/workflow.interface';
import type { ICreateWorkflowUseCase } from '@/application/port/usecases/workflows/createWorkflow.interface';
import type { IUpsertSecretsUseCase } from '@/application/port/usecases/workflows/upsertSecrets.interface';
import type { IGetSecretsUseCase } from '@/application/port/usecases/workflows/getSecrets.interface';
import type { IGetWorkflowsUseCase } from '@/application/port/usecases/workflows/getWorkflows.interface';
import type { IGetWorkflowByIdUseCase } from '@/application/port/usecases/workflows/getWorkflowById.interface';
import type { IRevealSecretUseCase } from '@/application/port/usecases/workflows/revealSecret.interface';
import type { ITriggerWorkflowRunUseCase } from '@/application/port/usecases/workflows/triggerWorkflowRun.interface';
import type { AuthenticatedContext } from '@/presentation/http/macros/auth.macro';
import type { CreateWorkflowOutputDto } from '@/application/dto/worflows/createWorkflow.dto';
import type { CreateWorkflowInputDto } from '@/application/dto/worflows/createWorkflow.dto';
import type { GetSecretsOutputDto } from '@/application/dto/worflows/getSecrets.dto';
import type { UpsertSecretsInputDto } from '@/application/dto/worflows/upsertSecrets.dto';
import { GetWorkflowsInputSchema } from '@/application/dto/worflows/getWorkflows.dto';
import { validate } from '../../validator';

@injectable()
export class WorkflowController implements IWorkflowController {
	constructor(
		@inject(TOKENS.CreateWorkflowUseCase)
		private createWorkflowUseCase: ICreateWorkflowUseCase,
		@inject(TOKENS.UpsertSecretsUseCase)
		private upsertSecretsUseCase: IUpsertSecretsUseCase,
		@inject(TOKENS.GetSecretsUseCase)
		private getSecretsUseCase: IGetSecretsUseCase,
		@inject(TOKENS.GetWorkflowsUseCase)
		private getWorkflowsUseCase: IGetWorkflowsUseCase,
		@inject(TOKENS.GetWorkflowByIdUseCase)
		private getWorkflowByIdUseCase: IGetWorkflowByIdUseCase,
		@inject(TOKENS.RevealSecretUseCase)
		private revealSecretUseCase: IRevealSecretUseCase,
		@inject(TOKENS.TriggerWorkflowRunUseCase)
		private triggerWorkflowRunUseCase: ITriggerWorkflowRunUseCase,
	) { }

	getWorkflows = async (ctx: AuthenticatedContext) => {
		const query = validate(GetWorkflowsInputSchema, ctx.query);
		return this.getWorkflowsUseCase.execute({
			req: ctx.user,
			query: query,
		});
	};
	getWorkflowById = async (ctx: AuthenticatedContext) => {
		const id = ctx.params.id;
		return this.getWorkflowByIdUseCase.execute({ id, req: ctx.user });
	};

	triggerWorkflowRun = async (ctx: AuthenticatedContext) => {
		const workflowId = ctx.params.id;
		const version = ctx.query.version
			? Number.parseInt(ctx.query.version as string, 10)
			: undefined;
		return this.triggerWorkflowRunUseCase.execute({ workflowId, version, req: ctx.user });
	};

	revealSecret = async (ctx: AuthenticatedContext) => {
		const workflowId = ctx.params.id;
		const key = ctx.params.key as string;
		return this.revealSecretUseCase.execute({ id: workflowId, key, req: ctx.user });
	};

	createWorkflow = async (ctx: AuthenticatedContext): Promise<CreateWorkflowOutputDto> => {
		const body = ctx.body as Omit<CreateWorkflowInputDto, 'req'>;
		return this.createWorkflowUseCase.execute({
			...body,
			req: ctx.user,
		});
	};

	upsertSecrets = async (ctx: AuthenticatedContext): Promise<{ count: number }> => {
		const workflowId = ctx.params.id;
		const body = ctx.body as UpsertSecretsInputDto;
		return this.upsertSecretsUseCase.execute({
			...body,
			id: workflowId,
			req: ctx.user,
		});
	};

	getSecrets = async (ctx: AuthenticatedContext): Promise<GetSecretsOutputDto> => {
		const workflowId = ctx.params.id;
		return this.getSecretsUseCase.execute({
			id: workflowId,
			req: ctx.user,
		});
	};
}
