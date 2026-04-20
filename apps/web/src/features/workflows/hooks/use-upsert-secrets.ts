import { useMutation } from '@tanstack/react-query';
import { workflowService } from '../service/workflow.service';

export const useUpsertSecrets = (workflowId: string) => {
	return useMutation({
		mutationFn: (secrets: { key: string; value: string }[]) =>
			workflowService.upsertSecrets(workflowId, { secrets })
	});
};
