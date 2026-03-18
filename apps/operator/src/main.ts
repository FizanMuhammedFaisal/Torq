import 'reflect-metadata';
import { container } from './config/di/container';
import type { CRDManager } from './infrastructure/k8s/ensureCrd';
import type { GRpcServer } from './presentation/grpc/rpc-server';
import { TOKENS } from './config/di/tokens';
async function main() {
    const grpcServer = container.resolve<GRpcServer>(TOKENS.GRPCServer);
    const crdManager = container.resolve<CRDManager>(TOKENS.CRDManager);
    //ensure the torq crd is preset
    // ensureCrd()
    await crdManager.ensureCrd();
    //  start grpc server
    await grpcServer.start();

    // connect to message queue

    // start the main reconsiliation loop
}

await main();
