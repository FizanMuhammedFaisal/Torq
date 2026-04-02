import { apiClient } from '@/api/client';
import { API_ROUTES } from '@/api/routes';
import type {
	CreateWorkflowPayload,
	CreateWorkflowResponse,
	GetWorkflowsResponse,
	GetWorkflowByIdResponse,
	UpsertSecretsPayload,
	UpsertSecretsResponse,
	GetSecretsResponse,
	RevealSecretResponse,
	TriggerWorkflowPayload,
	TriggerWorkflowResponse,
} from '../schema/api.dto';

export const workflowService = {
	create: async (payload: CreateWorkflowPayload): Promise<CreateWorkflowResponse> => {
		const { data } = await apiClient.post<CreateWorkflowResponse>(
			API_ROUTES.WORKFLOWS.BASE,
			payload,
		);
		return data;
	},

	getWorkflows: async (): Promise<GetWorkflowsResponse> => {
		const { data } = await apiClient.get<GetWorkflowsResponse>(
			API_ROUTES.WORKFLOWS.BASE,
		);
		return data;
	},

	getById: async (id: string): Promise<GetWorkflowByIdResponse> => {
		const { data } = await apiClient.get<GetWorkflowByIdResponse>(
			API_ROUTES.WORKFLOWS.BY_ID(id),
		);
		return data;
	},

	upsertSecrets: async (
		workflowId: string,
		payload: UpsertSecretsPayload,
	): Promise<UpsertSecretsResponse> => {
		const { data } = await apiClient.post<UpsertSecretsResponse>(
			API_ROUTES.WORKFLOWS.SECRETS(workflowId),
			payload,
		);
		return data;
	},

	getSecrets: async (
		workflowId: string,
	): Promise<GetSecretsResponse> => {
		const { data } = await apiClient.get<GetSecretsResponse>(API_ROUTES.WORKFLOWS.SECRETS(workflowId));
		return data;
	},

	revealSecret: async (
		workflowId: string,
		key: string,
	): Promise<RevealSecretResponse> => {
		const { data } = await apiClient.get<RevealSecretResponse>(
			API_ROUTES.WORKFLOWS.REVEAL_SECRET(workflowId, key),
		);
		return data;
	},

	trigger: async (workflowId: string, payload?: TriggerWorkflowPayload): Promise<TriggerWorkflowResponse> => {
		const { data } = await apiClient.post<TriggerWorkflowResponse>(
			API_ROUTES.WORKFLOWS.TRIGGER(workflowId),
			payload,
		);
		return data;
	},
};
