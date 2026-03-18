import type { AuthenticatedContext } from '@/presentation/http/macros/auth.macro';
import type { CreateWorkflowOutputDto } from '@/application/dto/worflows/createWorkflow.dto';
import type { GetSecretsOutputDto } from '@/application/dto/worflows/getSecrets.dto';
import type { UpsertSecretsOutputDto } from '@/application/dto/worflows/upsertSecrets.dto';
import type { RevealSecretOutputDto } from '@/application/dto/worflows/revealSecret.dto';
import type { GetWorkflowsOutputDto } from '@/application/dto/worflows/getWorkflows.dto';

export interface IWorkflowController {
	getWorkflows: (ctx: AuthenticatedContext) => Promise<GetWorkflowsOutputDto>;
	createWorkflow: (ctx: AuthenticatedContext) => Promise<CreateWorkflowOutputDto>;
	upsertSecrets: (ctx: AuthenticatedContext) => Promise<UpsertSecretsOutputDto>;
	getSecrets: (ctx: AuthenticatedContext) => Promise<GetSecretsOutputDto>;
	triggerWorkflowRun: (ctx: AuthenticatedContext) => Promise<any>;
	revealSecret: (ctx: AuthenticatedContext) => Promise<RevealSecretOutputDto>;
}
