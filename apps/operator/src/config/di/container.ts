import { container, Lifecycle } from 'tsyringe';

import { TOKENS } from './tokens';
import { GRpcServer } from '@/presentation/grpc/rpc-server';

import { RPCRouter } from '@/presentation/grpc/routers/router';
import { CRDManager } from '@/infrastructure/k8s/ensureCrd';


container.register(TOKENS.GRPCServer, { useClass: GRpcServer }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.RPCRouter, { useClass: RPCRouter }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.CRDManager, { useClass: CRDManager }, { lifecycle: Lifecycle.Singleton });

export { container };
