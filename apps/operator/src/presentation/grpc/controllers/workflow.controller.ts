import type { HandlerContext } from '@connectrpc/connect';
import type { TriggerWorkflowRunRequest, TriggerWorkflowRunResponse } from '@torq-system/grpc';
import type { IWorkflowRunController } from '../interfaces/controllers/workflow.interface';

export class WorkflowController implements IWorkflowRunController {
    triggerRun(
        request: TriggerWorkflowRunRequest,
        context: HandlerContext,
    ): Promise<TriggerWorkflowRunResponse> {
        throw new Error('Method not implemented.');
    }
}
