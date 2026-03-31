export const TOKENS = {
	RPCRouter: Symbol('RPCRouter'),
	GRPCServer: Symbol('GRPCServer'),
	CRDManager: Symbol('CRDManager'),
	HealthServer: Symbol('HealthServer'),
	CRDWatcher: Symbol('CRDWatcher'),
	JobWatcher: Symbol('JobWatcher'),
	K8sWatchManager: Symbol('K8sWatchManager'),
	Reconciler: Symbol('Reconciler'),
	CleanupService: Symbol('CleanupService'),
	ReconcilerVersionRouter: Symbol('ReconcilerVersionRouter'),
	SpecCache: Symbol('SpecCache'),
	GRPCClient: Symbol('GRPCClient'),
	RedisClient: Symbol('RedisClient'),

	//reconcilation hanlders

} as const;
