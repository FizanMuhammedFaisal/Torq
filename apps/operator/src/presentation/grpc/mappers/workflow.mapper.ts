import type {
	TriggerRunInput,
	TriggerType as DomainTriggerType,
} from '@/application/dto/triggerRun';
import { TriggerType, type TriggerWorkflowRunRequest } from "@torq-system/grpc/operator/workflowrun/v1";
import type { IWorkflowRPCMapper } from '../interfaces/mappers/workflow.interface';
import { injectable } from 'tsyringe';

@injectable()
export class WorkflowMapper implements IWorkflowRPCMapper {

	fromProtoGetTriggerWorkflowRunRequest(request: TriggerWorkflowRunRequest): TriggerRunInput {
		return {
			workflowId: request.workflowId,
			versionId: request.versionId,
			torqVersion: request.torqVersion,
			triggerType: this.mapTriggerType(request.triggerType),
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
