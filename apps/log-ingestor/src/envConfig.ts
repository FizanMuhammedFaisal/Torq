export const Envconfig = {
	server: {
		port: process.env.PORT || 4001,
		hostname: process.env.HOSTNAME || 'localhost',
		url: `http://${process.env.HOSTNAME ?? 'localhost'}:${process.env.PORT ?? '4001'}`,
	},
	database: {
		url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
	},
	app: {
		name: 'TORQ Log Ingestor',
		version: process.env.APP_VERSION || '0.0.1',
		nodeEnv: process.env.NODE_ENV || 'development',
	},
	redis: {
		url: `redis://${process.env.REDIS_HOST ?? 'localhost'}:${process.env.REDIS_PORT ?? 6379}`,
	},
	ingetionConfig: {
		BATCH_SIZE: parseInt(process.env.BATCH_SIZE ?? '200'),
		FLUSH_INTERVAL_MS: parseInt(process.env.FLUSH_INTERVAL_MS ?? '500'),
		MAX_BUFFER_SIZE: parseInt(process.env.MAX_BUFFER_SIZE ?? '5000'),
		WORKFLOW_RUN_LABEL: 'torq/workflow-run-id',
	},
};
export type Envconfig = typeof Envconfig;
