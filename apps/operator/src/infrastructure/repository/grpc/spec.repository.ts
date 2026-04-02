import type { ISpecRepository } from '@/application/port/repository/spec.interface';
import type { ICacheService } from '@/application/port/services/cache.interface';
import { TOKENS } from '@/config/di/tokens';
import { WorkflowSpec } from '@/domain/entities/workflowSpec';
import type { GrpcClient } from '@/infrastructure/grpc/client';
import { type GetSpecResponse, TriggerType } from "@torq-system/grpc/apiserver/workflowrun/v1";
import type { TriggerType as DomainTriggerType } from '@domain/entities/workflow';
import type { JsonObject } from '@bufbuild/protobuf';
import { logger } from '@/infrastructure/logger/logger';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SpecRepository implements ISpecRepository {
	constructor(
		@inject(TOKENS.SpecCache) private specCache: ICacheService,
		@inject(TOKENS.GRPCClient) private rpcClient: GrpcClient,
	) { }
	async getSpec(id: string): Promise<WorkflowSpec | null> {
		const [error, data] = await this.specCache.get<WorkflowSpec>(id);

		if (!error && data) {
			return data;
		} else {
			// Fetch from gRPC if cache miss or error
			const client = this.rpcClient.getApiServerClient();
			try {
				const res = await client.getSpec({ workflowRunId: id });

				if (res) {
					const workflowSpec = this.fromProtoToWorkflowSpec(res);
					await this.specCache.set(id, workflowSpec);
					return workflowSpec;
				}
			} catch (error) {
				logger.error({ error, workflowRunId: id }, 'Failed to fetch spec from gRPC');
				// error hanlding should be gracefull
				return null
			}
			return null;
		}
	}
	fromProtoToWorkflowSpec(protoSpec: GetSpecResponse): WorkflowSpec {
		function mapTriggerType(triggerType: TriggerType): DomainTriggerType {
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
		function mapSpecType(spec: JsonObject | undefined): Record<string, unknown> {
			return structuredClone(spec) as Record<string, unknown>;
		}
		return WorkflowSpec.create({
			workflowId: protoSpec.workflowId,
			versionId: protoSpec.versionId,
			torqVersion: protoSpec.torqVersion,
			triggerType: mapTriggerType(protoSpec.triggerType),
			spec: mapSpecType(protoSpec.spec),
			secrets: protoSpec.secrets,
			createdAt: new Date(protoSpec.createdAt),
		});
	}
}
