import http2 from 'node:http2';
import { inject, injectable } from 'tsyringe';
import { connectNodeAdapter } from '@connectrpc/connect-node';
import { errorInterceptor } from './interceptors/error.interceptor';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import type { IRPCRouter } from './interfaces/router.interface';
import { logger } from '@/infrastructure/logger/logger';
import { TOKENS } from '@/config/di/tokens';
import { rpcConfig } from '@/config/rpc.config';
import { readFileSync } from 'node:fs';

@injectable()
export class GRpcServer {
	private server: http2.Http2Server | null = null;

	constructor(@inject(TOKENS.RPCRouter) private readonly rpcRouter: IRPCRouter) { }

	async start(): Promise<void> {
		const { port, host } = rpcConfig;

		const handler = connectNodeAdapter({
			routes: (router) => this.rpcRouter.register(router),
			grpc: true,
			connect: false,
			interceptors: [errorInterceptor, loggingInterceptor],
		});

		const tlsKeyPath = process.env.TLS_KEY_PATH;
		const tlsCertPath = process.env.TLS_CERT_PATH;

		if (tlsKeyPath && tlsCertPath) {
			// K8s / TLS mode
			this.server = http2.createSecureServer(
				{
					key: readFileSync(tlsKeyPath),
					cert: readFileSync(tlsCertPath),
				},
				handler,
			);
			logger.info("Starting with tls mode")
		} else {
			// Local dev - plain h2c
			this.server = http2.createServer(handler);
		}

		await new Promise<void>((resolve, reject) => {
			this.server?.listen(port, host, () => {
				logger.info({ port, host }, 'gRPC server started successfully');
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
