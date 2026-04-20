import type {
	TriggerRunInput,
	TriggerType as DomainTriggerType,
} from '@/application/dto/triggerRun';
import type { Registry } from '@/domain/registry';
import {
	TriggerType,
	type TriggerWorkflowRunRequest,
} from '@torq-system/grpc/operator/workflowrun/v1';
import type { IWorkflowRPCMapper } from '../interfaces/mappers/workflow.interface';
import { injectable } from 'tsyringe';

@injectable()
export class WorkflowMapper implements IWorkflowRPCMapper {
	fromProtoGetTriggerWorkflowRunRequest(request: TriggerWorkflowRunRequest): TriggerRunInput {
		return {
			runId: request.workflowRunId,
			workflowId: request.workflowId,
			versionId: request.versionId,
			torqVersion: request.torqVersion as Registry, // gRPC hands us a plain string; API server validates the value at the boundary
			triggerType: this.mapTriggerType(request.triggerType),
			createdAt: new Date(), // stamp at the moment the gRPC request arrives
		};
	}

	private mapTriggerType(triggerType: TriggerType): DomainTriggerType {
		switch (triggerType) {
			case TriggerType.MANUAL:
				return 'MANUAL';
			case TriggerType.WEBHOOK:
				return 'WEBHOOK';
			case TriggerType.SCHEDULE:
				return 'SCHEDULE';
			default:
				return 'MANUAL';
		}
	}
}
