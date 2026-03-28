import { useQuery } from '@tanstack/react-query';
import { workflowService } from '../service/workflow.service';

export const useWorkflow = (id: string | undefined) => {
	return useQuery({
		queryKey: ['workflow', id],
		queryFn: () => {
			if (!id) throw new Error('Workflow ID is required');
			return workflowService.getById(id);
		},
		enabled: !!id,
	});
};
