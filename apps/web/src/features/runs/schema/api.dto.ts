import type { PaginationMeta } from '@/features/workflows/schema/api.dto';

export interface RunDto {
	id: string;
	workflowId: string;
	workflowName?: string;
	status: string;
	trigger?: string;
	startedAt?: string;
	completedAt?: string;
	durationMs?: number;
	namespace?: string;
	stepCount?: number;
	steps: Record<string, { status: string; ts?: number }>;
}

export interface GetRunsResponse {
	data: RunDto[];
	meta: PaginationMeta;
}
