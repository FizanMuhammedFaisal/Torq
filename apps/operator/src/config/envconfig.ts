export const Envconfig = {
	server: {
		port: process.env.PORT || 4001,
		hostname: process.env.HOSTNAME || 'localhost',
	},
	database: {
		url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
	},
	app: {
		name: 'TORQ Operator',
		version: process.env.APP_VERSION || '0.0.1',
		cors: {
			origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:4000'],
		},
	},

	services: {
		grpc: {
			apiServer: {
				baseUrl: process.env.API_SERVER_GRPC_BASE_URL || 'http://localhost:50052',
			},
		},
	},
	grpc: {
		PORT: process.env.RPC_PORT || 50051,
		HOST: process.env.RPC_HOST || 'localhost',
	},
	k8s: {
		group: process.env.K8S_GROUP || 'torq.dev',
		version: process.env.K8S_VERSION || 'v1alpha1',
		plural: process.env.K8S_PLURAL || 'workflowruns',
		namespace: process.env.K8S_NAMESPACE || 'default',
		kind: process.env.K8S_KIND || 'WorkflowRun',
	},
	redis: {
		url: `redis://${process.env.REDIS_HOST ?? 'localhost'}:${process.env.REDIS_PORT ?? 6379}`,
	}
};
export type Envconfig = typeof Envconfig;
