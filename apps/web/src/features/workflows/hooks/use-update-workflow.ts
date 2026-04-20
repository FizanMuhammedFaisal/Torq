import { useMutation } from '@tanstack/react-query';
import { workflowService } from '../service/workflow.service';
import type { UpdateWorkflowPayload } from '../schema/api.dto';

export const useUpdateWorkflow = (workflowId: string) => {
    return useMutation({
        mutationFn: (payload: UpdateWorkflowPayload) =>
            workflowService.updateWorkflow(workflowId, payload)
    });
};
