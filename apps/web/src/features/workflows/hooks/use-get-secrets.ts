import { useQuery } from '@tanstack/react-query';
import { workflowService } from '../service/workflow.service';

export const useGetSecrets = (workflowId: string) => {
	return useQuery({
		queryKey: ['secrets', workflowId],
		queryFn: () => workflowService.getSecrets(workflowId),
		enabled: !!workflowId,
	});
};
