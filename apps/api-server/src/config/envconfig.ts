export const Envconfig = {
	server: {
		port: process.env.PORT || 4000,
		hostname: process.env.HOSTNAME || 'localhost',
	},
	database: {
		url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
	},
	app: {
		name: 'TORQ API Server',
		version: process.env.APP_VERSION || '0.0.1',
		cors: {
			origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
		},
		masterKeyFile: './src/config/torq/master.key',
	},
	services: {
		email: {
			resendKey: process.env.RESEND_KEY || 'NEEDED',
			//resend verified domain since implemented service uses resend
			appEmail: process.env.APP_EMAIL || 'fizanmuhammedfaisal@gmail.com',
		},
		googleAuth: {
			clientId: process.env.GOOGLE_CLIENT_ID || 'NEEDED',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'NEEDED',
		},
		grpc: {
			operator: {
				baseUrl: process.env.OPERATOR_GRPC_URL || 'http://localhost:50051',
			}
		}
	},
	grpc: {
		PORT: process.env.GRPC_PORT || 50052,
		HOST: process.env.GRPC_HOST || 'localhost',
	}
};
export type Envconfig = typeof Envconfig;
