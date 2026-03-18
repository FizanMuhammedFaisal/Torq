import http2 from 'node:http2';
import { inject, injectable } from 'tsyringe';
import { connectNodeAdapter } from '@connectrpc/connect-node';
import { errorInterceptor } from './interceptors/error.interceptor';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import type { IRPCRouter } from './interfaces/router.interface';
import { logger } from '@/infrastructure/logger/logger';
import { TOKENS } from '@/config/di/tokens';
import { rpcConfig } from '@/config/rpc.config';


@injectable()
export class GRpcServer {
	private server: http2.Http2Server | null = null;

	constructor(@inject(TOKENS.RPCRouter) private readonly rpcRouter: IRPCRouter) { }

	async start(): Promise<void> {
		const { port, host } = rpcConfig;

		this.server = http2.createServer(
			connectNodeAdapter({
				routes: (router) => this.rpcRouter.register(router),
				grpc: true,
				connect: false,
				interceptors: [errorInterceptor, loggingInterceptor],
			}),
		);

		await new Promise<void>((resolve, reject) => {
			this.server?.listen(port, host, () => {
				logger.info({ port, host, protocol: 'HTTP/2' }, 'gRPC server started successfully');
				resolve();
			});

			this.server?.on('error', (error) => {
				logger.error({ error }, 'Failed to start gRPC server');
				reject(error);
			});
		});
	}

	async stop(): Promise<void> {
		if (!this.server) {
			return;
		}

		await new Promise<void>((resolve, reject) => {
			this.server?.close((error) => {
				if (error) {
					logger.error({ error }, 'Error stopping gRPC server');
					reject(error);
				} else {
					logger.info('gRPC server stopped successfully');
					resolve();
				}
			});
		});

		this.server = null;
	}
}
