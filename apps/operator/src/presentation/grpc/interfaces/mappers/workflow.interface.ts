import type { TriggerRunInput } from '@/application/dto/triggerRun';
import type { TriggerWorkflowRunRequest } from '@torq-system/grpc';

export interface IWorkflowRPCMapper {
	fromProtoGetTriggerWorkflowRunRequest(request: TriggerWorkflowRunRequest): TriggerRunInput;
}
