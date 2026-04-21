import Elysia from 'elysia';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { RunController } from '@/presentation/http/controller/run.controller';
import type { Router } from '@/presentation/http/interfaces/routes';
import type { AuthMacro } from '@/presentation/http/macros/auth.macro';
import { GetRunsQueryInputSchema } from '@/application/dto/runs/getRuns.dto';
import type { IRunController } from '../../interfaces/controller/runController.interface';
import { StreamRunLogsSchema } from '@/application/dto/runs/streamRunLogs';

@injectable()
export class RunRouter implements Router {
	readonly prefix = '/runs';

	constructor(
		@inject(TOKENS.RunController)
		private readonly runController: IRunController,
		@inject(TOKENS.AuthMacro)
		private readonly authMacro: AuthMacro,
	) { }

	register() {
		return new Elysia({ prefix: this.prefix }).use(this.streamRunLogs()).use(this.getRuns());
	}
	getRuns() {
		return new Elysia().use(this.authMacro.plugin()).get(
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
	streamRunLogs() {
		return new Elysia().use(this.authMacro.plugin()).post(
			'/runlogs',
			(ctx) => {
				return this.runController.streamRunLogs(ctx);
			},
			{
				body: StreamRunLogsSchema,
				auth: false,
			},
		);
	}
}
