import { apiClient } from '@/api/client';
import { API_ROUTES } from '@/api/routes';
import type { GetRunsResponse } from '../schema/api.dto';

export const runService = {
	list: async (): Promise<GetRunsResponse> => {
		const { data } = await apiClient.get<GetRunsResponse>(API_ROUTES.RUNS.BASE);
		return data;
	},
};
