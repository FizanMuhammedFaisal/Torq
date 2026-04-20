import { useQuery } from '@tanstack/react-query';
import { workflowService } from '../service/workflow.service';
import type { GetWorkflowByIdQuery } from '../schema/api.dto';

export const useWorkflow = (id: string | undefined, params?: GetWorkflowByIdQuery) => {
	return useQuery({
		queryKey: ['workflow', id, params],
		queryFn: () => {
			if (!id) throw new Error('Workflow ID is required');
			return workflowService.getById(id, params);
		},
		enabled: !!id,
	});
};
