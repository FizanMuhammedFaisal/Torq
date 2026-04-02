import { container, Lifecycle } from 'tsyringe';
import { TOKENS } from './tokens';
import { GRpcServer } from '@/presentation/grpc/rpcServer';
import { RPCRouter } from '@/presentation/grpc/routers/router';
import { CRDManager } from '@/infrastructure/k8s/ensureCrd';
import { CRDWatcher } from '@/infrastructure/k8s/watchers/CRDWatcher';
import { JobWatcher } from '@/infrastructure/k8s/watchers/jobWatcher';
import { K8sWatchManager } from '@/infrastructure/k8s/watch';
import { HealthServer } from '@/presentation/http/health';
import { SpecCacheService } from '@/infrastructure/service/SpecCache.service';
import { WorkflowController } from '@/presentation/grpc/controllers/workflow.controller';
import { TriggerRunUseCase } from '@/application/usecases/triggerRun.usecase';
import { WorkflowRunDispatcherService } from '@/infrastructure/service/workflowRunDispatcher.service';
import { WorkflowRunRepository } from '@/infrastructure/repository/k8s/workflowRun.repository';
import { WorkflowMapper } from '@/presentation/grpc/mappers/workflow.mapper';
import { Reconciler } from '@/application/reconcile/reconciler';
import { CleanUpService } from '@/infrastructure/service/cleanUp.service';
import { ReconcilerVersionRouter } from '@/application/reconcile/reconcilerVersionRouter';
import { V1AlphaReconciliationHandler } from '@/application/reconcile/handlers/v1apha.handler';
import { SpecRepository } from '@/infrastructure/repository/grpc/spec.repository';
import { GrpcClient } from '@/infrastructure/grpc/client';
import { RedisClient } from '@/infrastructure/messageBroker/client';


container.register(TOKENS.GRPCServer, { useClass: GRpcServer }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.RPCRouter, { useClass: RPCRouter }, { lifecycle: Lifecycle.Singleton });
container.register(
	TOKENS.HealthServer,
	{ useClass: HealthServer },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(TOKENS.CRDManager, { useClass: CRDManager }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.CRDWatcher, { useClass: CRDWatcher }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.JobWatcher, { useClass: JobWatcher }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.IWorkflowRunController, { useClass: WorkflowController }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.WorkflowRunDispatcherService, { useClass: WorkflowRunDispatcherService }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.TriggerRunUseCase, { useClass: TriggerRunUseCase }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.WorkflowRunRepository, { useClass: WorkflowRunRepository }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.WorkflowRunMapper, { useClass: WorkflowMapper }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.Reconciler, { useClass: Reconciler }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.CleanupService, { useClass: CleanUpService }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.ReconcilerVersionRouter, { useClass: ReconcilerVersionRouter }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.V1AlphaReconciliationHandler, { useClass: V1AlphaReconciliationHandler }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.SpecRepository, { useClass: SpecRepository }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.SpecCache, { useClass: SpecCacheService }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.GRPCClient, { useClass: GrpcClient }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.RedisClient, { useClass: RedisClient }, { lifecycle: Lifecycle.Singleton });


container.register(
	TOKENS.K8sWatchManager,
	{ useClass: K8sWatchManager },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(
	TOKENS.SpecCache,
	{ useClass: SpecCacheService },
	{ lifecycle: Lifecycle.Singleton },
);


export { container };
