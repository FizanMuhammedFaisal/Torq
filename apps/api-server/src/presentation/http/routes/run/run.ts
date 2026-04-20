import Elysia from 'elysia';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { RunController } from '@/presentation/http/controller/run.controller';
import type { Router } from '@/presentation/http/interfaces/routes';
import type { AuthMacro } from '@/presentation/http/macros/auth.macro';
import { GetRunsQueryInputSchema } from '@/application/dto/runs/getRuns.dto';

@injectable()
export class RunRouter implements Router {
	readonly prefix = '/runs';

	constructor(
		@inject(TOKENS.RunController)
		private readonly runController: RunController,
		@inject(TOKENS.AuthMacro)
		private readonly authMacro: AuthMacro,
	) {}

	register() {
		return new Elysia({ prefix: this.prefix }).use(this.authMacro.plugin()).get(
			'/',
			(ctx) => {
				return this.runController.getRuns(ctx);
			},
			{
				auth: true,
				query: GetRunsQueryInputSchema,
			},
		);
	}
}
