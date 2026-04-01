import type { HandlerContext } from '@connectrpc/connect';
import {
	TriggerWorkflowRunResponseSchema,
	type TriggerWorkflowRunRequest,
	type TriggerWorkflowRunResponse,
} from '@torq-system/grpc';
import type { IWorkflowRunController } from '../interfaces/controllers/workflow.interface';
import { inject } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { ITriggerRunUseCase } from '@/application/port/usecases/triggerRun.interface';
import type { IWorkflowRPCMapper } from '../interfaces/mappers/workflow.interface';
import { create } from '@bufbuild/protobuf';

export class WorkflowController implements IWorkflowRunController {
	constructor(
		@inject(TOKENS.TriggerRunUseCase) private triggerRunUseCase: ITriggerRunUseCase,
		@inject(TOKENS.WorkflowRunMapper) private workflowRPCMapper: IWorkflowRPCMapper,
	) {}

	async triggerRun(
		request: TriggerWorkflowRunRequest,
		_context: HandlerContext,
	): Promise<TriggerWorkflowRunResponse> {
		const workflow = this.workflowRPCMapper.fromProtoGetTriggerWorkflowRunRequest(request);

		const res = await this.triggerRunUseCase.execute(workflow);

		return create(TriggerWorkflowRunResponseSchema, {
			runId: res.runId,
		});
	}
}
