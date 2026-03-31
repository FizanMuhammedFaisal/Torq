import { container, Lifecycle } from 'tsyringe';

import { TOKENS } from './tokens';
import { GRpcServer } from '@/presentation/grpc/rpc-server';

import { RPCRouter } from '@/presentation/grpc/routers/router';
import { CRDManager } from '@/infrastructure/k8s/ensureCrd';
import { CRDWatcher } from '@/infrastructure/k8s/watchers/CRDWatcher';
import { JobWatcher } from '@/infrastructure/k8s/watchers/jobWatcher';
import { K8sWatchManager } from '@/infrastructure/k8s/watch';
import { HealthServer } from '@/presentation/http/health';
import { SpecCacheService } from '@/infrastructure/service/SpecCache.service';

container.register(TOKENS.GRPCServer, { useClass: GRpcServer }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.RPCRouter, { useClass: RPCRouter }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.HealthServer, { useClass: HealthServer }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.CRDManager, { useClass: CRDManager }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.CRDWatcher, { useClass: CRDWatcher }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.JobWatcher, { useClass: JobWatcher }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.K8sWatchManager, { useClass: K8sWatchManager }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.SpecCache, { useClass: SpecCacheService }, { lifecycle: Lifecycle.Singleton });

export { container };
