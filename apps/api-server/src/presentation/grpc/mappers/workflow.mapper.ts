import {
	GetWorkflowSpecInput,
	GetWorkflowSpecOutput,
} from '@/application/dto/worflows/getWorkflowSpec.dto';
import {
	GetSpecRequest,
	GetSpecResponse,
	GetSpecResponseSchema,
	Secrets,
	SecretsSchema,
} from '@torq-system/grpc';
import { IWorkflowRPCMapper } from '../interfaces/mappers/workflow.interface';
import { create, JsonObject, toJson } from '@bufbuild/protobuf';
export class WorkflowRPCMapper implements IWorkflowRPCMapper {
	fromProtoGetSpecRequest(request: GetSpecRequest): GetWorkflowSpecInput {
		return {
			workflowId: request.workflowRunId,
			versionId: request.versionId,
		};
	}
	toProtoGetSpecResponse(dto: GetWorkflowSpecOutput): GetSpecResponse {
		function toProtoSecrets(secrets: { name: string; value: string }[]): Secrets[] {
			return secrets.map((secret) => create(SecretsSchema, secret));
		}
		function mapSpecType(spec: Record<string, unknown>): JsonObject {
			return JSON.parse(JSON.stringify(spec)) as JsonObject;
		}
		return create(GetSpecResponseSchema, {
			createdAt: dto.createdAt.toISOString(),
			spec: mapSpecType(dto.spec),
			secrets: toProtoSecrets(dto.secrets),
			versionId: dto.versionId,
			workflowId: dto.workflowId,
		});
	}
}
