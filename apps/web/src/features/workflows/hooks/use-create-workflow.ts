import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { ApiErrorBody, AxiosError } from '@/api/client';
import {
	type CreateWorkflowPayload,
	type WorkflowResponse,
	workflowService,
} from '../service/workflow.service';

export function useCreateWorkflow(): UseMutationResult<
	WorkflowResponse,
	AxiosError<ApiErrorBody>,
	CreateWorkflowPayload
> {
	return useMutation({
		mutationFn: (payload: CreateWorkflowPayload) =>
			workflowService.create(payload),
	});
}
