import { Elysia } from 'elysia';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { AuthRouter } from './auth/auth';
import type { HealthRouter } from './health/health';
import type { WorkflowRouter } from './workflow/workflow';
import type { RunRouter } from './run/run';

@injectable()
export class AppRouter {
	constructor(
		@inject(TOKENS.AuthRouter) private authRouter: AuthRouter,
		@inject(TOKENS.HealthRouter) private healthRouter: HealthRouter,
		@inject(TOKENS.WorkflowRouter) private workflowRouter: WorkflowRouter,
		@inject(TOKENS.RunRouter) private runRouter: RunRouter,
	) {}

	getRoutes() {
		return new Elysia()
			.use(this.healthRouter.register())
			.use(this.workflowRouter.register())
			.use(this.runRouter.register())
			.use(this.authRouter.register());
	}
}
