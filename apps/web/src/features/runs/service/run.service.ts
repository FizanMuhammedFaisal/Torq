import { apiClient } from '@/api/client';
import { API_ROUTES } from '@/api/routes';
import type { GetRunsResponse } from '../schema/api.dto';

export const runService = {
	list: async (params?: { workflowId?: string }): Promise<GetRunsResponse> => {
		const { data } = await apiClient.get<GetRunsResponse>(API_ROUTES.RUNS.BASE, { params });
		return data;
	},
};
