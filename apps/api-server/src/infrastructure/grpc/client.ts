import { Envconfig } from '@/config/envconfig';
import { type Transport, type Client, createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { OperatorService } from '@torq-system/grpc';
import { loggingInterceptor } from './interceptors/loggingInterceptor';
// Keep-alive settings
// https://github.com/connectrpc/connect-es/pull/673 read if want to know aboout keep alive
export class GrpcClient {
    private operatorClient: Client<typeof OperatorService>;
    private operatorTransport: Transport;
    constructor() {
        this.operatorTransport = createGrpcTransport({
            baseUrl: Envconfig.services.grpc.operator.baseUrl,
            pingIntervalMs: 300000,
            interceptors: [loggingInterceptor],
        });
        this.operatorClient = createClient(OperatorService, this.operatorTransport)
    }
    getOperatorClient(): Client<typeof OperatorService> {
        return this.operatorClient
    }
}
