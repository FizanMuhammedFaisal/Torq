import type { HandlerContext } from '@connectrpc/connect';
import type { TriggerWorkflowRunRequest, TriggerWorkflowRunResponse } from '@torq-system/grpc';
import type { IWorkflowRunController } from '../interfaces/controllers/workflow.interface';
import { inject } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { ITriggerRunUseCase } from '@/application/port/usecases/triggerRun.interface';
import type { IWorkflowRPCMapper } from '../interfaces/mappers/workflow.interface';

export class WorkflowController implements IWorkflowRunController {
    constructor(
        @inject(TOKENS.TriggerRunUseCase) private triggerRunUseCase: ITriggerRunUseCase,
        @inject(TOKENS.WorkflowRunMapper) private workflowRPCMapper: IWorkflowRPCMapper,
    ) { }

    triggerRun(
        request: TriggerWorkflowRunRequest,
        context: HandlerContext,
    ): Promise<TriggerWorkflowRunResponse> {
        const workflow = this.workflowRPCMapper.fromProtoGetTriggerWorkflowRunRequest(request)

        this.triggerRunUseCase.execute(workflow)
    }
}
