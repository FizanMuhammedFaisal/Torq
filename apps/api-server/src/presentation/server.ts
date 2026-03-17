import { cors } from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { container } from '@/config/di/container';
import { TOKENS } from '@/config/di/tokens';
import type { AppRouter } from '@/presentation/routes';
import type { ErrorMacro } from '@/presentation/macros/error.macro';
import { Envconfig } from '../config/envconfig';
import { OpenAPI } from './routes/auth/openapi';

export class HTTPServer {
	private app: Elysia;
	private envconfig: Envconfig;

	constructor() {
		this.envconfig = Envconfig;
		this.app = new Elysia();
	}

	private async configureOpenAPI() {
		this.app.use(
			openapi({
				documentation: {
					components: await OpenAPI.components,
					paths: await OpenAPI.getPaths(),
				},
			}),
		);
	}

	private setupRoutes() {
		const appRouter = container.resolve<AppRouter>(TOKENS.AppRouter);
		const errorMacro = container.resolve<ErrorMacro>(TOKENS.ErrorMacro);

		this.app.use(errorMacro.plugin()).use(appRouter.getRoutes());
	}

	private configureCORS() {
		this.app.use(
			cors({
				origin: this.envconfig.app.cors.origins,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
				credentials: true,
				allowedHeaders: ['Content-Type', 'Authorization'],
			}),
		);
	}
	async start() {
		await this.configureOpenAPI();
		this.configureCORS();
		this.setupRoutes();
		this.app.listen(this.envconfig.server.port);

		console.log(`🦊 Server is running at ${this.app.server?.hostname}:${this.app.server?.port}`);
	}
}
