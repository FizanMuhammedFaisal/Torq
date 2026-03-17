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

	},
	grpc: {
		PORT: process.env.RPC_PORT || 50051,
		HOST: process.env.RPC_HOST || 'localhost',
	}
};
export type Envconfig = typeof Envconfig;
