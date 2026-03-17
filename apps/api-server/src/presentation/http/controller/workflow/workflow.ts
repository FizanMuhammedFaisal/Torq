import { inject, injectable } from 'tsyringe';
import type { IWorkflowController } from '@/presentation/http/interfaces/controller/workflow.interface';
import type { ICreateWorkflowUseCase } from '@/application/port/usecases/workflows/createWorkflow.interface';
import type { IUpsertSecretsUseCase } from '@/application/port/usecases/workflows/upsertSecrets.interface';
import type { IGetSecretsUseCase } from '@/application/port/usecases/workflows/getSecrets.interface';
import type { IGetWorkflowsUseCase } from '@/application/port/usecases/workflows/getWorkflows.interface';
import type { ICreateRunUseCase } from '@/application/port/usecases/workflows/createRun.interface';
import type { IRevealSecretUseCase } from '@/application/port/usecases/workflows/revealSecret.interface';
import type { AuthenticatedContext } from '@/presentation/http/macros/auth.macro';
import { TOKENS } from '@/config/di/tokens';
import type { CreateWorkflowOutputDto } from '@/application/dto/worflows/createWorkflow.dto';
import type { CreateWorkflowInputDto } from '@/application/dto/worflows/createWorkflow.dto';
import type { GetSecretsOutputDto } from '@/application/dto/worflows/getSecrets.dto';
import type { UpsertSecretsInputDto } from '@/application/dto/worflows/upsertSecrets.dto';
import type { CreateRunInputDto } from '@/application/dto/worflows/createRun.dto';

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
		@inject(TOKENS.CreateRunUseCase)
		private createRunUseCase: ICreateRunUseCase,
		@inject(TOKENS.RevealSecretUseCase)
		private revealSecretUseCase: IRevealSecretUseCase,
	) {}

	getWorkflows = async (ctx: AuthenticatedContext) => {
		return this.getWorkflowsUseCase.execute({ req: ctx.user });
	};

	createRun = async (ctx: AuthenticatedContext) => {
		const workflowId = ctx.params.id;
		const body = ctx.body as CreateRunInputDto;
		return this.createRunUseCase.execute({ ...body, workflowId, req: ctx.user });
	};

	revealSecret = async (ctx: AuthenticatedContext) => {
		const workflowId = ctx.params.id;
		const key = ctx.params.key as string;
		return this.revealSecretUseCase.execute({ workflowId, key, req: ctx.user });
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
			workflowId,
			req: ctx.user,
		});
	};

	getSecrets = async (ctx: AuthenticatedContext): Promise<GetSecretsOutputDto> => {
		const workflowId = ctx.params.id;
		return this.getSecretsUseCase.execute({
			workflowId,
			req: ctx.user,
		});
	};
}
