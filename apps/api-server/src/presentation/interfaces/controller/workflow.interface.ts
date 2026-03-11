import type { AuthenticatedContext } from '@/presentation/macros/auth.macro';
import type { Context } from 'elysia';
import type { CreateWorkflowOutputDto } from '@/application/dto/worflows/createWorkflow.dto';
import type { GetSecretsOutputDto } from '@/application/dto/worflows/getSecrets.dto';

export interface IWorkflowController {
	getWorkflows: (ctx: Context) => Promise<{ message: string }>;
	createWorkflow: (ctx: AuthenticatedContext) => Promise<CreateWorkflowOutputDto>;
	upsertSecrets: (ctx: AuthenticatedContext) => Promise<{ count: number }>;
	getSecrets: (ctx: AuthenticatedContext) => Promise<GetSecretsOutputDto>;
}
