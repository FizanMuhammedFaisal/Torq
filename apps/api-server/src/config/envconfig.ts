export const Envconfig = {
	server: {
		port: process.env.PORT || 4000,
		hostname: process.env.HOSTNAME || 'localhost',
	},
	database: {
		url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
	},
	app: {
		version: process.env.APP_VERSION || '0.0.1',
		cors: {
			origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
		},
	},
};
export type Envconfig = typeof Envconfig;
