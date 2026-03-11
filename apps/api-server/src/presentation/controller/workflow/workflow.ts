import type { Context } from 'elysia';
import { inject, injectable } from 'tsyringe';
import type { IWorkflowController } from '@/presentation/interfaces/controller/workflow.interface';
import type { ICreateWorkflowUseCase } from '@/application/port/usecases/workflows/createWorkflow.interface';
import type { IUpsertSecretsUseCase } from '@/application/port/usecases/workflows/upsertSecrets.interface';
import type { IGetSecretsUseCase } from '@/application/port/usecases/workflows/getSecrets.interface';
import type { AuthenticatedContext } from '@/presentation/macros/auth.macro';
import { TOKENS } from '@/config/di/tokens';
import type { CreateWorkflowOutputDto } from '@/application/dto/worflows/createWorkflow.dto';
import type { CreateWorkflowInputDto } from '@/application/dto/worflows/createWorkflow.dto';
import type { GetSecretsOutputDto } from '@/application/dto/worflows/getSecrets.dto';

@injectable()
export class WorkflowController implements IWorkflowController {
	constructor(
		@inject(TOKENS.CreateWorkflowUseCase)
		private createWorkflowUseCase: ICreateWorkflowUseCase,
		@inject(TOKENS.UpsertSecretsUseCase)
		private upsertSecretsUseCase: IUpsertSecretsUseCase,
		@inject(TOKENS.GetSecretsUseCase)
		private getSecretsUseCase: IGetSecretsUseCase,
	) { }

	getWorkflows = async (_ctx: Context): Promise<{ message: string }> => {
		return { message: 'Workflow' };
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
		const body = ctx.body as any;
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
