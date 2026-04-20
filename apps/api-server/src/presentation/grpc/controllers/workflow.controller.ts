import type { HandlerContext } from '@connectrpc/connect';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import { create } from '@bufbuild/protobuf';
import type { IWorkflowRPCController } from '../interfaces/controllers/workflow.interface';
import {
	type GetSpecRequest,
	type GetSpecResponse,
	GetSpecResponseSchema,
} from '@torq-system/grpc';
import type { IWorkflowRPCMapper } from '../interfaces/mappers/workflow.interface';
import type { IGetWorkflowSpecUseCase } from '@/application/port/usecases/workflows/getWorkflowSpec.interface';

@injectable()
export class WorkflowRunController implements IWorkflowRPCController {
	constructor(
		@inject(TOKENS.WorkflowRPCMapper) private workflowRPCMapper: IWorkflowRPCMapper,
		@inject(TOKENS.GetWorkflowSpecUseCase) private getWorkflowSpecUseCase: IGetWorkflowSpecUseCase,
	) {}
	async getSpec(request: GetSpecRequest, _context: HandlerContext): Promise<GetSpecResponse> {
		const workflow = this.workflowRPCMapper.fromProtoGetSpecRequest(request);

		const res = await this.getWorkflowSpecUseCase.execute(workflow);

		return create(GetSpecResponseSchema, this.workflowRPCMapper.toProtoGetSpecResponse(res));
	}
}
