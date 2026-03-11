import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { workflowService } from '../service/workflow.service';

export const useUpsertSecrets = (workflowId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (secrets: { key: string; value: string }[]) =>
			workflowService.upsertSecrets(workflowId, secrets),
		onSuccess: () => {
			toast.success('Secrets updated successfully');
			// Invalidate relevant queries if needed, e.g., workflow details if they include secrets info
			// queryClient.invalidateQueries({ queryKey: ['workflow', workflowId] });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update secrets');
		},
	});
};
