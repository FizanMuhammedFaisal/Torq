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
	IWorkflowRunDispatcherService: Symbol('IWorkflowRunDispatcherService'),

	// usecase
	TriggerRunUseCase: Symbol("TriggerRunUseCase"),

	// mapper
	IWorkflowRPCMapper: Symbol("IWorkflowRPCMapper"),
	//RPC
	IWorkflowRunController: Symbol("IWorkflowRunController")
	//reconcilation hanlders

} as const;
