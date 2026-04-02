import { z } from 'zod';
import type { AuthUser } from '@/presentation/http/macros/auth.macro';

export const WorkflowRunStatusSchema = z.enum(['running', 'success', 'failed', 'idle']);
export type WorkflowRunStatus = z.infer<typeof WorkflowRunStatusSchema>;

export const WorkflowRunSummarySchema = z.object({
	status: WorkflowRunStatusSchema,
	startedAt: z.date(),
	completedAt: z.date().nullable(),
	duration: z.number().nullable(),
});

export type WorkflowRunSummary = z.infer<typeof WorkflowRunSummarySchema>;

export const GetWorkflowsInputSchema = z.object({
	sortBy: z.enum(["createdAt", "name", "lastRunAt"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
	page: z.number().int().min(1).default(1).optional(),
	pageSize: z.number().int().min(1).max(100).default(20).optional(),
	status: z.array(WorkflowRunStatusSchema).optional(),
	search: z.string().optional(),
});

export type GetWorkflowsQueryInputDto = z.infer<typeof GetWorkflowsInputSchema>
export interface GetWorkflowsInputDto {
	req: AuthUser;
	query: GetWorkflowsQueryInputDto;
}

export interface GetWorkflowsOutputDto {
	workflows: {
		id: string;
		name: string;
		description: string | undefined;
		createdAt: Date;
		health: (boolean | null)[];
		lastRun: WorkflowRunSummary | null;
	}[],
	meta: {
		totalItems: number;
		page: number;
		pageSize: number;
		totalPages: number;
	};
}
