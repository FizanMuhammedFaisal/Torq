import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { ApiErrorBody, AxiosError } from '@/api/client';
import {
	workflowService,
} from '../service/workflow.service';
import type { CreateWorkflowPayload, CreateWorkflowResponse } from '../schema/api.dto';

export function useCreateWorkflow(): UseMutationResult<
	CreateWorkflowResponse,
	AxiosError<ApiErrorBody>,
	CreateWorkflowPayload
> {
	return useMutation({
		mutationFn: (payload: CreateWorkflowPayload) =>
			workflowService.create(payload),
	});
}
