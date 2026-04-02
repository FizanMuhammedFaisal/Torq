import type { HandlerContext } from '@connectrpc/connect';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import { create } from '@bufbuild/protobuf';
import { type IWorkflowRunController } from '../interfaces/controllers/workflow.interface';
import { GetSpecRequest, GetSpecResponse, GetSpecResponseSchema } from '@torq-system/grpc';
import type { IWorkflowRPCMapper } from '../interfaces/mappers/workflow.interface';
import { type IGetWorkflowSpecUseCase } from '@/application/port/usecases/workflows/getWorkflowSpec.interface';

@injectable()
export class WorkflowController implements IWorkflowRunController {
    constructor(
        @inject(TOKENS.WorkflowRunMapper) private workflowRPCMapper: IWorkflowRPCMapper,
        @inject(TOKENS.GetWorkflowSpecUseCase) private getWorkflowSpecUseCase: IGetWorkflowSpecUseCase,
    ) { }
    async triggerRun(request: GetSpecRequest, context: HandlerContext): Promise<GetSpecResponse> {
        const workflow = this.workflowRPCMapper.fromProtoGetSpecRequest(request);

        const res = await this.getWorkflowSpecUseCase.execute(workflow)

        return create(GetSpecResponseSchema, this.workflowRPCMapper.toProtoGetSpecResponse(res));
    }
}
