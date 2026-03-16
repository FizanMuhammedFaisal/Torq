import { Elysia } from 'elysia';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { AuthRouter } from './auth/auth';
import type { HealthRouter } from './health/health';
import type { WorkflowRouter } from './workflow/workflow';

@injectable()
export class AppRouter {
	constructor(
		@inject(TOKENS.AuthRouter) private authRouter: AuthRouter,
		@inject(TOKENS.HealthRouter) private healthRouter: HealthRouter,
		@inject(TOKENS.WorkflowRouter) private workflowRouter: WorkflowRouter,
	) {}

	getRoutes() {
		return new Elysia()
			.use(this.healthRouter.register())
			.use(this.workflowRouter.register())
			.use(this.authRouter.register());
	}
}
