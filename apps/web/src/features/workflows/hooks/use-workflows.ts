import { useQuery } from '@tanstack/react-query';
import { workflowService } from '../service/workflow.service';
import type { GetWorkflowsResponse } from '../schema/api.dto';

export const useWorkflows = () => {
	return useQuery({
		queryKey: ['workflows'],
		queryFn: async (): Promise<GetWorkflowsResponse> => {
			return await workflowService.getWorkflows();
		},
	});
};
