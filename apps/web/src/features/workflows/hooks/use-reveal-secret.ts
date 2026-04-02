import { useMutation } from '@tanstack/react-query';
import { workflowService } from '../service/workflow.service';

export const useRevealSecret = (workflowId: string) => {
	return useMutation({
		mutationFn: (key: string) => workflowService.revealSecret(workflowId, key),
	});
};
