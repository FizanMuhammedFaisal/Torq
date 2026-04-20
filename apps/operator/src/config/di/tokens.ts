export const TOKENS = {
	RPCRouter: Symbol('RPCRouter'),
	GRPCServer: Symbol('GRPCServer'),
	CRDManager: Symbol('CRDManager'),
	HealthServer: Symbol('HealthServer'),
	CRDWatcher: Symbol('CRDWatcher'),
	JobWatcher: Symbol('JobWatcher'),
	K8sWatchManager: Symbol('K8sWatchManager'),
	Reconciler: Symbol('Reconciler'),
	ReconcilerVersionRouter: Symbol('ReconcilerVersionRouter'),
	SpecCache: Symbol('SpecCache'),
	GRPCClient: Symbol('GRPCClient'),
	RedisClient: Symbol('RedisClient'),
	SpecRepository: Symbol('SpecRepository'),

	// services
	CleanupService: Symbol('CleanupService'),
	WorkflowRunDispatcherService: Symbol('WorkflowRunDispatcherService'),
	JobService: Symbol('JobService'),

	// usecase
	TriggerRunUseCase: Symbol('TriggerRunUseCase'),

	// repo
	WorkflowRunRepository: Symbol('WorkflowRunRepository'),
	JobRepository: Symbol('JobRepository'),
	WorkflowRunStatusRepository: Symbol('WorkflowRunStatusRepository'),

	// mapper
	WorkflowRunMapper: Symbol('WorkflowRunMapper'),
	//RPC
	IWorkflowRunController: Symbol('IWorkflowRunController'),
	//reconcilation hanlders
	V1AlphaReconciliationHandler: Symbol('V1AlphaReconciliationHandler'),
	// job building
	JobBuilderVersionRouter: Symbol('JobBuilderVersionRouter'),
	V1AlphaJobBuilder: Symbol('V1AlphaJobBuilder'),
	// infra
	LogForwarderManager: Symbol('LogForwarderManager'),
	RedisPublisher: Symbol('RedisPublisher'),
} as const;
