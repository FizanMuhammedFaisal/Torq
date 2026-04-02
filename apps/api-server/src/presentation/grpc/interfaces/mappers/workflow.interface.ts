import {
	GetWorkflowSpecInput,
	GetWorkflowSpecOutput,
} from '@/application/dto/worflows/getWorkflowSpec.dto';
import type { GetSpecRequest, GetSpecResponse } from '@torq-system/grpc';
export interface IWorkflowRPCMapper {
	fromProtoGetSpecRequest(request: GetSpecRequest): GetWorkflowSpecInput;
	toProtoGetSpecResponse(dto: GetWorkflowSpecOutput): GetSpecResponse;
}
