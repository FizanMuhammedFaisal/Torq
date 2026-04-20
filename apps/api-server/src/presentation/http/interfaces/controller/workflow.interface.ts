import type { AuthenticatedContext } from '@/presentation/http/macros/auth.macro';
import type { CreateWorkflowOutputDto } from '@/application/dto/worflows/createWorkflow.dto';
import type { GetSecretsOutputDto } from '@/application/dto/worflows/getSecrets.dto';
import type { UpsertSecretsOutputDto } from '@/application/dto/worflows/upsertSecrets.dto';
import type { RevealSecretOutputDto } from '@/application/dto/worflows/revealSecret.dto';
import type { GetWorkflowsOutputDto } from '@/application/dto/worflows/getWorkflows.dto';
import type { TriggerWorkflowRunOutputDto } from '@/application/dto/worflows/triggerWorkflowRun.dto';
import type { GetWorkflowByIdOutputDto } from '@/application/dto/worflows/getWorkflowById.dto';

export interface IWorkflowController {
	getWorkflows: (ctx: AuthenticatedContext) => Promise<GetWorkflowsOutputDto>;
	createWorkflow: (ctx: AuthenticatedContext) => Promise<CreateWorkflowOutputDto>;
	upsertSecrets: (ctx: AuthenticatedContext) => Promise<UpsertSecretsOutputDto>;
	getSecrets: (ctx: AuthenticatedContext) => Promise<GetSecretsOutputDto>;
	triggerWorkflowRun: (ctx: AuthenticatedContext) => Promise<TriggerWorkflowRunOutputDto>;
	revealSecret: (ctx: AuthenticatedContext) => Promise<RevealSecretOutputDto>;
	getWorkflowById: (ctx: AuthenticatedContext) => Promise<GetWorkflowByIdOutputDto>;
}
