import 'reflect-metadata';
import { container } from './config/di/container';
import type { ICRDManager } from './infrastructure/k8s/ensureCrd';
import type { GRpcServer } from './presentation/grpc/rpcServer';
import { TOKENS } from './config/di/tokens';
import type { IHealthServer } from './presentation/http/health';
import type { K8sWatchManager } from './infrastructure/k8s/watch';
import type { RedisClientInterface } from './infrastructure/messageBroker/Client.interface';

async function Main() {
	const grpcServer = container.resolve<GRpcServer>(TOKENS.GRPCServer);
	const crdManager = container.resolve<ICRDManager>(TOKENS.CRDManager);
	const healthServer = container.resolve<IHealthServer>(TOKENS.HealthServer);
	const k8sWatchManager = container.resolve<K8sWatchManager>(TOKENS.K8sWatchManager);
	const redisClient = container.resolve<RedisClientInterface>(TOKENS.RedisClient);

	healthServer.start();
	//ensure the torq crd is preset
	// ensureCrd()
	await crdManager.ensureCrd();
	//  start grpc server
	await grpcServer.start();

	// connect to message queue
	await redisClient.getClient();
	// start watchers right before marking as ready
	await k8sWatchManager.startWatchers();

	// Graceful shutdown handling
	process.on('SIGTERM', async () => {
		console.log('SIGTERM received, shutting down gracefully');
		await close();
		process.exit(0);
	});
	process.on('SIGINT', async () => {
		console.log('SIGINT received, shutting down gracefully');
		await close();
		process.exit(0);
	});

	async function close() {
		await redisClient.closeClient();
		await grpcServer.stop();
		healthServer.markNotReady();
		await k8sWatchManager.stopWatchers();
	}
}

await Main();
