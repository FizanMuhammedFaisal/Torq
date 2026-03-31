import type { ISpecRepository } from '@/application/port/repository/spec.interface';
import type { ICacheService } from '@/application/port/services/cache.interface';
import { TOKENS } from '@/config/di/tokens';
import type { GrpcClient } from '@/infrastructure/grpc/client';
import { inject } from 'tsyringe';

export class SpecRepository implements ISpecRepository {
    constructor(
        @inject(TOKENS.SpecCache) private specCache: ICacheService,
        @inject(TOKENS.GRPCClient) private rpcClient: GrpcClient
    ) { }
    async getSpec(id: string): Promise<Record<string, unknown> | null> {
        const [error, data] = await this.specCache.get<Record<string, unknown>>(id);

        if (!error && data) {
            return data;
        } else {
            // Fetch from gRPC if cache miss or error
            const client = this.rpcClient.getApiServerClient()

            return null; // Placeholder
        }
    }
}
