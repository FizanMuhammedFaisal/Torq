import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { ApiErrorBody, AxiosError } from '@/api/client';
import { workflowService } from '../service/workflow.service';

export function useTriggerRun(workflowId: string | undefined): UseMutationResult<
	{ runId: string },
	AxiosError<ApiErrorBody>,
	number | undefined
> {
	return useMutation({
		mutationFn: (version?: number) => {
			if (!workflowId) throw new Error('Workflow ID is required');
			return workflowService.trigger(workflowId, version);
		},
	});
}
