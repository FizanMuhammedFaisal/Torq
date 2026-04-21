import type {
	GetWorkflowSpecInput,
	GetWorkflowSpecOutput,
} from '@/application/dto/worflows/getWorkflowSpec.dto';
import {
	type GetSpecRequest,
	type GetSpecResponse,
	GetSpecResponseSchema,
	type Secrets,
	SecretsSchema,
} from '@torq-system/grpc';
import type { IWorkflowRPCMapper } from '../interfaces/mappers/workflow.interface';
import { create, type JsonObject, toJson } from '@bufbuild/protobuf';
export class WorkflowRPCMapper implements IWorkflowRPCMapper {
	fromProtoGetSpecRequest(request: GetSpecRequest): GetWorkflowSpecInput {
		return {
			workflowId: request.workflowRunId,
			versionId: request.versionId,
			secrets: true, // Operator ned th secrects,
			raw: false,
		};
	}
	toProtoGetSpecResponse(dto: GetWorkflowSpecOutput): GetSpecResponse {
		function toProtoSecrets(secrets: { name: string; value: string }[] | undefined): Secrets[] {
			if (!secrets) return [];
			return secrets.map((secret) => create(SecretsSchema, secret));
		}
		function mapSpecType(spec: Record<string, unknown> | string): JsonObject {
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
