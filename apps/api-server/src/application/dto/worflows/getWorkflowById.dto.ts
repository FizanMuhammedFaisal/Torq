import type { AuthUser } from '@/presentation/http/macros/auth.macro';
import type { WorkflowRunStatus } from '@/domain/entities/workflowRun';

export interface GetWorkflowByIdInputDto {
	id: string;
	req: AuthUser;
}

export interface GetWorkflowByIdOutputDto {
	id: string;
	name: string;
	description: string | undefined;
	createdAt: Date;
	status: WorkflowRunStatus;
}
