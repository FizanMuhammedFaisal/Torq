import 'reflect-metadata';
import { container } from './config/di/container';
import type { ICRDManager } from './infrastructure/k8s/ensureCrd';
import type { GRpcServer } from './presentation/grpc/rpc-server';
import { TOKENS } from './config/di/tokens';
import type { IHealthServer } from './presentation/http/health';
import type { K8sWatchManager } from './infrastructure/k8s/watch';

async function Main() {
	const grpcServer = container.resolve<GRpcServer>(TOKENS.GRPCServer);
	const crdManager = container.resolve<ICRDManager>(TOKENS.CRDManager);
	const healthServer = container.resolve<IHealthServer>(TOKENS.HealthServer);
	const k8sWatchManager = container.resolve<K8sWatchManager>(TOKENS.K8sWatchManager);

	healthServer.start()
	//ensure the torq crd is preset
	// ensureCrd()
	await crdManager.ensureCrd();
	//  start grpc server
	await grpcServer.start();

	// connect to message queue
	
	// start watchers right before marking as ready
	await k8sWatchManager.startWatchers();

	// start the main reconsiliation loop
	// marks that server is ready to recive things for k8s
	healthServer.markReady();
}

await Main();
