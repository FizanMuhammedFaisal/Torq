import { z } from 'zod';
import type { AuthUser } from '@/presentation/http/macros/auth.macro';

export const GetRunsQueryInputSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
	search: z.string().optional(),
	workflowId: z.string().optional(),
});

export type GetRunsQueryInputDto = z.infer<typeof GetRunsQueryInputSchema>;

export interface GetRunsInputDto {
	req: AuthUser;
	query: GetRunsQueryInputDto;
}

export interface RunDto {
	id: string;
	workflowId: string;
	workflowName: string;
	status: string;
	trigger: string;
	startedAt: string;
	completedAt: string | undefined;
	durationMs: number | undefined;
	namespace: string;
	stepCount: number;
	steps: Record<string, { status: string; ts?: number }>;
}

export interface GetRunsOutputDto {
	data: RunDto[];
	meta: {
		totalItems: number;
		page: number;
		pageSize: number;
		totalPages: number;
	};
}
