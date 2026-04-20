import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { ApiErrorBody, AxiosError } from '@/api/client';
import { workflowService } from '../service/workflow.service';
import type { TriggerWorkflowResponse } from '../schema/api.dto';

export function useTriggerRun(): UseMutationResult<
	TriggerWorkflowResponse,
	AxiosError<ApiErrorBody>,
	{ id: string; version?: number }
> {
	return useMutation({
		mutationFn: ({ id, version }) => {
			return workflowService.trigger(id, { version });
		},
	});
}
