import type { AuthUser } from '@/presentation/http/macros/auth.macro';
import type { RunStatus } from '@/domain/entities/workflowRun';
import z from 'zod';

export const GetWorkflowByIdInputParamsSchema = z.object({
	id: z.string(),
});
export const GetWorkflowByIdInputQuerySchema = z.object({
	expand: z.preprocess(
		// The Preprocessor: If it's a string, wrap it in an array.
		(val) => (typeof val === 'string' ? [val] : val),
		z.array(z.enum(['latestRun', 'totalRuns', 'averageDuration'])).optional(),
	),
});

export interface GetWorkflowByIdInputDto {
	id: z.infer<typeof GetWorkflowByIdInputParamsSchema>['id'];
	expand?: z.infer<typeof GetWorkflowByIdInputQuerySchema>['expand'];
	req: AuthUser;
}

export interface WorkflowJobDto {
	name?: string;
	description?: string;
	steps?: any[]; // Still quite dynamic, but better than top-level any
}

export interface WorkflowSpecDto {
	jobs: Record<string, WorkflowJobDto>;
	triggers?: any[];
	version?: string;
}

export interface StepStatusDto {
	status: string;
	ts?: number;
}

export interface GetWorkflowByIdOutputDto {
	id: string;
	name: string;
	description: string | undefined;
	createdAt: Date;
	status?: RunStatus;
	spec?: WorkflowSpecDto;
	latestRun?: {
		id: string;
		status: RunStatus;
		startedAt: Date;
		completedAt?: Date;
		duration?: number;
		steps: Record<string, StepStatusDto>;
	};
	totalRuns?: number;
	averageDuration?: number; // in seconds
}
