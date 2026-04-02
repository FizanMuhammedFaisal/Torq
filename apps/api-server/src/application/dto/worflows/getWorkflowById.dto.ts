import type { AuthUser } from '@/presentation/http/macros/auth.macro';
import type { RunStatus } from '@/domain/entities/workflowRun';
import z from 'zod';
import type { WorkflowRunSummary } from './getWorkflows.dto';

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

export interface GetWorkflowByIdOutputDto {
	id: string;
	name: string;
	description: string | undefined;
	createdAt: Date;
	status?: RunStatus;
	latestRun?: WorkflowRunSummary;
	totalRuns?: number;
	averageDuration?: number; // in seconds
}
