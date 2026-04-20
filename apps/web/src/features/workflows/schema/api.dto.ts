import type { WorkflowWithLatestRun, WorkflowStatus } from '../types';


export interface PaginationMeta {
	totalItems: number;
	page: number;
	pageSize: number;
	totalPages: number;
}


export interface CreateWorkflowPayload {
	name: string;
	description?: string;
	workflowSpec: string;
	specFormat: 'yaml' | 'json';
	secrets?: { key: string; value: string }[];
}

export interface CreateWorkflowResponse {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
}


export interface GetWorkflowsQuery {
	sortBy?: 'createdAt' | 'name' | 'lastRunAt';
	sortOrder?: 'asc' | 'desc';
	page?: number;
	pageSize?: number;
	status?: WorkflowStatus[];
	search?: string;
}

export type { Workflow, WorkflowWithLatestRun, WorkflowRunSummary, WorkflowRun, WorkflowSecret } from '../types';

export interface GetWorkflowsResponse {
	workflows: WorkflowWithLatestRun[];
	meta: PaginationMeta;
}

export interface GetWorkflowByIdQuery {
	expand?: ('latestRun' | 'totalRuns' | 'averageDuration')[];
}

export interface WorkflowJobDto {
	name?: string;
	description?: string;
	steps?: any[];
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

export interface GetWorkflowByIdResponse {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
	status?: WorkflowStatus;
	spec?: WorkflowSpecDto;
	latestRun?: {
		id: string;
		status: WorkflowStatus;
		startedAt: string;
		completedAt?: string;
		duration?: number;
		steps: Record<string, StepStatusDto>;
	};
	totalRuns?: number;
	averageDuration?: number;
}

// sercts endpoint
export interface UpsertSecretsPayload {
	secrets: { key: string; value: string }[] | { key: string; value: string };
}

export interface UpsertSecretsResponse {
	count: number;
}

export interface SecretItemDto {
	id: string;
	key: string;
	createdAt: string;
	updatedAt: string;
}

export type GetSecretsResponse = SecretItemDto[];

export interface RevealSecretResponse {
	key: string;
	value: string;
}

// RUNS
export interface TriggerWorkflowPayload {
	version?: number;
}

export interface TriggerWorkflowResponse {
	runId: string;
	workflowId: string;
	status: WorkflowStatus;
}


export interface GetWorkflowBySpecPayload {
	versionId?: string
}


export interface GetWorkflowBySpecResponse {
	workflowId: string;
	versionId: string;
	spec: string;
	createdAt: Date;
}
export interface UpdateWorkflowPayload {
	raw?: string,
	name?: string,
	description?: string
}


export interface UpdateWorkflowResponse {
	id: string,
	name: string,
	description?: string
	raw?: string
}