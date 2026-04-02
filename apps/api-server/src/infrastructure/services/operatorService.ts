import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { GrpcClient } from '@/infrastructure/grpc/client';
import type { Client } from '@connectrpc/connect';
import {
	TriggerType as GrpcTriggerType,
	type OperatorService as OperatorServiceClient,
} from '@torq-system/grpc/operator/workflowrun/v1';
import type {
	IOperatorService,
	TriggerWorkflowRunParams,
} from '@/application/port/services/operatorService.interface';
import type { TriggerType as DomainTriggerType } from '@/domain/entities/workflowRun';

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
			torqVersion: params.torqVersion,
			triggerType: this.mapTriggerType(params.triggerType),
			versionId: params.versionId,
		});
	}
	private mapTriggerType(domainType: DomainTriggerType): GrpcTriggerType {
		switch (domainType) {
			case 'MANUAL':
				return GrpcTriggerType.MANUAL;
			case 'SCHEDULE':
				return GrpcTriggerType.SCHEDULE;
			case 'WEBHOOK':
				return GrpcTriggerType.WEBHOOK;
			default:
				throw new Error(`Unknown TriggerType: ${domainType}`);
		}
	}
}
