import { inject, injectable } from 'tsyringe';

import { TOKENS } from '@/config/di/tokens';
import type { GrpcClient } from '@/infrastructure/grpc/client';
import type { Client } from '@connectrpc/connect';
import type { OperatorService as OperatorServiceClient } from '@torq-system/grpc';
import type {
	IOperatorService,
	TriggerWorkflowRunParams,
} from '@/application/port/services/operatorService.interface';

@injectable()
export class OperatorService implements IOperatorService {
	private client: Client<typeof OperatorServiceClient>;
	constructor(
		@inject(TOKENS.GrpcClient)
		private readonly grpcClient: GrpcClient,
	) {
		this.client = this.grpcClient.getOperatorClient();
	}

	async triggerWorkflowRun(params: TriggerWorkflowRunParams): Promise<void> {
		await this.client.triggerWorkflowRun({
			workflowId: params.workflowId,
			spec: params.spec,
		});
	}
}

