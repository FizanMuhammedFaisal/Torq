import { useQuery } from '@tanstack/react-query';
import { workflowService } from '../service/workflow.service';
import { useWorkFlowActions, useWorkFlowStore } from '@/store/workflow';

export const useGetWorkflowSpec = (workflowId: string, versionId?: string) => {
    const { workflows } = useWorkFlowStore();
    const { addWorkflow } = useWorkFlowActions();
    const existing = workflows[workflowId]

    return useQuery({
        queryKey: ['workflowSpec', workflowId, versionId],
        queryFn: async () => {
            const data = await workflowService.getWorkflowSpec(workflowId)
            addWorkflow(data.workflowId, {
                workflowId: data.workflowId,
                saved: true,
                spec: data.spec,
                versionId: data.versionId,
                editingSpec: data.spec
            })
            return data;
        },
        enabled: !existing?.spec,
        staleTime: Infinity
    });
};
