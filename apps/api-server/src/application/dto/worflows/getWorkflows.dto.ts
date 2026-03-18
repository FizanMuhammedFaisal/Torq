import { z } from 'zod';
import type { AuthUser } from '@/presentation/http/macros/auth.macro';

export const WorkflowRunStatusSchema = z.enum(['running', 'success', 'failed', 'idle']);
export type WorkflowRunStatus = z.infer<typeof WorkflowRunStatusSchema>;

export const WorkflowRunSummarySchema = z.object({
	status: WorkflowRunStatusSchema,
	startedAt: z.date(),
	completedAt: z.date().nullable(),
	duration: z.number().nullable(),
	steps: z.number().int(),
});

export type WorkflowRunSummary = z.infer<typeof WorkflowRunSummarySchema>;

export interface GetWorkflowsInputDto {
	req: AuthUser;
}

export interface GetWorkflowsOutputDto {
	workflows: {
		id: string;
		name: string;
		description: string | undefined;
		createdAt: Date;
		health: (boolean | null)[];
		lastRun: WorkflowRunSummary | null;
		status: WorkflowRunStatus;
	}[];
}
