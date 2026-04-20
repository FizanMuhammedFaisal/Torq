import { apiClient } from '@/api/client';
import { API_ROUTES } from '@/api/routes';
import type {
	CreateWorkflowPayload,
	CreateWorkflowResponse,
	GetWorkflowsResponse,
	GetWorkflowByIdQuery,
	GetWorkflowByIdResponse,
	UpsertSecretsPayload,
	UpsertSecretsResponse,
	GetSecretsResponse,
	RevealSecretResponse,
	TriggerWorkflowPayload,
	TriggerWorkflowResponse,
	GetWorkflowBySpecPayload,
	GetWorkflowBySpecResponse,
	UpdateWorkflowPayload,
	UpdateWorkflowResponse,
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

	getById: async (id: string, params?: GetWorkflowByIdQuery): Promise<GetWorkflowByIdResponse> => {
		const { data } = await apiClient.get<GetWorkflowByIdResponse>(
			API_ROUTES.WORKFLOWS.BY_ID(id),
			{ params },
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
	getWorkflowSpec: async (workflowId: string, payload?: GetWorkflowBySpecPayload): Promise<GetWorkflowBySpecResponse> => {
		const { data } = await apiClient.get<GetWorkflowBySpecResponse>(
			API_ROUTES.WORKFLOWS.GET_SPEC(workflowId),

		);
		return data;
	},
	updateWorkflow: async (workflowId: string, payload?: UpdateWorkflowPayload): Promise<UpdateWorkflowResponse> => {
		const { data } = await apiClient.patch<UpdateWorkflowResponse>(
			API_ROUTES.WORKFLOWS.BY_ID(workflowId),
			payload
		);
		return data;
	},
};
