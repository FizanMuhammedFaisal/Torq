import { container, Lifecycle } from 'tsyringe';

import { TOKENS } from './tokens';
import { GRpcServer } from '@/presentation/grpc/rpc-server';


container.register(TOKENS.GRPCServer, { useClass: GRpcServer }, { lifecycle: Lifecycle.Singleton });

export { container };
