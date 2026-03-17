import { apiClient } from '@/api/client';
import { API_ROUTES } from '@/api/routes';

export type CreateWorkflowPayload = {
	name: string;
	description?: string;
	workflowSpec: string;
	specFormat: 'yaml' | 'json';
	secrets?: { key: string; value: string }[];
};

export type WorkflowResponse = {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
};

export const workflowService = {
	create: async (payload: CreateWorkflowPayload): Promise<WorkflowResponse> => {
		const { data } = await apiClient.post<WorkflowResponse>(
			API_ROUTES.WORKFLOWS.BASE,
			payload,
		);
		return data;
	},

	list: async (): Promise<WorkflowResponse[]> => {
		const { data } = await apiClient.get<WorkflowResponse[]>(
			API_ROUTES.WORKFLOWS.BASE,
		);
		return data;
	},

	upsertSecrets: async (
		workflowId: string,
		secrets: { key: string; value: string }[],
	): Promise<{ count: number }> => {
		const { data } = await apiClient.post<{ count: number }>(
			API_ROUTES.WORKFLOWS.SECRETS(workflowId),
			{ secrets },
		);
		return data;
	},

	getSecrets: async (
		workflowId: string,
	): Promise<{ id: string; key: string; createdAt: string; updatedAt: string }[]> => {
		const { data } = await apiClient.get<
			{ id: string; key: string; createdAt: string; updatedAt: string }[]
		>(API_ROUTES.WORKFLOWS.SECRETS(workflowId));
		return data;
	},
};
