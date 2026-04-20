import { Envconfig } from '@/config/envconfig';
import { type Transport, type Client, createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { loggingInterceptor } from './interceptors/loggingInterceptor';
import { ApiServerService } from '@torq-system/grpc';
// Keep-alive settings
// https://github.com/connectrpc/connect-es/pull/673 read if want to know aboout keep alive
export class GrpcClient {
	private apiServerClient: Client<typeof ApiServerService>;
	private operatorTransport: Transport;
	constructor() {
		this.operatorTransport = createGrpcTransport({
			baseUrl: Envconfig.services.grpc.apiServer.baseUrl,
			pingIntervalMs: 300000,
			interceptors: [loggingInterceptor],
		});
		this.apiServerClient = createClient(ApiServerService, this.operatorTransport);
	}
	getApiServerClient(): Client<typeof ApiServerService> {
		return this.apiServerClient;
	}
}
