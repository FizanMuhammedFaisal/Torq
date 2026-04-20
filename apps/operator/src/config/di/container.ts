import { container, Lifecycle } from 'tsyringe';
import { TOKENS } from './tokens';
import { GRpcServer } from '@/presentation/grpc/rpcServer';
import { RPCRouter } from '@/presentation/grpc/routers/router';
import { CRDManager } from '@/infrastructure/k8s/crd/ensureCrd';
import { CRDWatcher } from '@/infrastructure/k8s/watchers/CRDWatcher';
import { JobWatcher } from '@/infrastructure/k8s/watchers/jobWatcher';
import { K8sWatchManager } from '@/infrastructure/k8s/watch';
import { HealthServer } from '@/presentation/http/health';
import { SpecCacheService } from '@/infrastructure/service/SpecCache.service';
import { WorkflowController } from '@/presentation/grpc/controllers/workflow.controller';
import { TriggerRunUseCase } from '@/application/usecases/triggerRun.usecase';
import { WorkflowRunDispatcherService } from '@/infrastructure/service/workflowRunDispatcher.service';
import { JobRepository } from '@/infrastructure/repository/k8s/jobs.repository';
import { WorkflowRunStatusRepository } from '@/infrastructure/repository/k8s/workflowRunStatus.repository';
import { WorkflowMapper } from '@/presentation/grpc/mappers/workflow.mapper';
import { Reconciler } from '@/application/reconcile/reconciler';
import { CleanUpService } from '@/infrastructure/service/cleanUp.service';
import { ReconcilerVersionRouter } from '@/application/reconcile/reconcilerVersionRouter';
import { V1AlphaReconciliationHandler } from '@/application/reconcile/handlers/v1alpha.handler';
import { SpecRepository } from '@/infrastructure/repository/grpc/spec.repository';
import { GrpcClient } from '@/infrastructure/grpc/client';
import { RedisClient } from '@/infrastructure/messageBroker/client';
import { LogForwarder } from '@/infrastructure/k8s/deamonSet/logForwarder/ensureDeamonSet';
import { JobService } from '@/infrastructure/service/job.service';
import { JobBuilderRouter } from '@/infrastructure/k8s/jobs/jobBuilderRouter';
import { V1AlphaJobBuilder } from '@/infrastructure/k8s/jobs/handlers/v1Alpha.handler';
import { RedisPublisher } from '@/infrastructure/messageBroker/redisMessageBroker';
import { WorkflowRunRepository } from '@/infrastructure/repository/k8s/workflowRun.repository';

const singleton = { lifecycle: Lifecycle.Singleton };

container.register(TOKENS.GRPCServer, { useClass: GRpcServer }, singleton);
container.register(TOKENS.RPCRouter, { useClass: RPCRouter }, singleton);
container.register(TOKENS.HealthServer, { useClass: HealthServer }, singleton);
container.register(TOKENS.IWorkflowRunController, { useClass: WorkflowController }, singleton);
container.register(TOKENS.WorkflowRunMapper, { useClass: WorkflowMapper }, singleton);

// k8s
container.register(TOKENS.CRDManager, { useClass: CRDManager }, singleton);
container.register(TOKENS.CRDWatcher, { useClass: CRDWatcher }, singleton);
container.register(TOKENS.JobWatcher, { useClass: JobWatcher }, singleton);
container.register(TOKENS.K8sWatchManager, { useClass: K8sWatchManager }, singleton);
container.register(TOKENS.LogForwarderManager, { useClass: LogForwarder }, singleton);

container.register(TOKENS.V1AlphaJobBuilder, { useClass: V1AlphaJobBuilder }, singleton);
container.register(TOKENS.JobBuilderVersionRouter, { useClass: JobBuilderRouter }, singleton);

// repos
container.register(TOKENS.WorkflowRunRepository, { useClass: WorkflowRunRepository }, singleton);
container.register(TOKENS.JobRepository, { useClass: JobRepository }, singleton);
container.register(TOKENS.WorkflowRunStatusRepository, { useClass: WorkflowRunStatusRepository }, singleton);
container.register(TOKENS.SpecRepository, { useClass: SpecRepository }, singleton);

// services
container.register(TOKENS.WorkflowRunDispatcherService, { useClass: WorkflowRunDispatcherService }, singleton);
container.register(TOKENS.JobService, { useClass: JobService }, singleton);
container.register(TOKENS.CleanupService, { useClass: CleanUpService }, singleton);
container.register(TOKENS.SpecCache, { useClass: SpecCacheService }, singleton);

// clients
container.register(TOKENS.GRPCClient, { useClass: GrpcClient }, singleton);
container.register(TOKENS.RedisClient, { useClass: RedisClient }, singleton);
container.register(TOKENS.RedisPublisher, { useClass: RedisPublisher }, singleton);

// reconciliation 
container.register(TOKENS.V1AlphaReconciliationHandler, { useClass: V1AlphaReconciliationHandler }, singleton);
container.register(TOKENS.ReconcilerVersionRouter, { useClass: ReconcilerVersionRouter }, singleton);
container.register(TOKENS.Reconciler, { useClass: Reconciler }, singleton);

// use-cases
container.register(TOKENS.TriggerRunUseCase, { useClass: TriggerRunUseCase }, singleton);

export { container };
