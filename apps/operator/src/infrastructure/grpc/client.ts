import { Envconfig } from '@/config/envconfig';
import { type Transport, type Client, createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { WorkflowService } from '@torq-system/grpc';
import { loggingInterceptor } from './interceptors/loggingInterceptor';
// Keep-alive settings
// https://github.com/connectrpc/connect-es/pull/673 read if want to know aboout keep alive
export class GrpcClient {
	private apiServerClient: Client<typeof WorkflowService>;
	private operatorTransport: Transport;
	constructor() {
		this.operatorTransport = createGrpcTransport({
			baseUrl: Envconfig.services.grpc.apiServer.baseUrl,
			pingIntervalMs: 300000,
			interceptors: [loggingInterceptor],
		});
		this.apiServerClient = createClient(WorkflowService, this.operatorTransport);
	}
	getApiServerClient(): Client<typeof WorkflowService> {
		return this.apiServerClient;
	}
}
