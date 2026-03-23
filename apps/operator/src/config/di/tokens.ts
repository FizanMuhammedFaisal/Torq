export const TOKENS = {
	RPCRouter: Symbol('RPCRouter'),
	GRPCServer: Symbol('GRPCServer'),
	CRDManager: Symbol('CRDManager'),
	HealthServer: Symbol('HealthServer'),
	WorkflowRunWatcher: Symbol('WorkflowRunWatcher'),
	JobWatcher: Symbol('JobWatcher'),
	K8sWatchManager: Symbol('K8sWatchManager'),

} as const;
