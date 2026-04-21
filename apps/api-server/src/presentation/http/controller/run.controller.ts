import { TOKENS } from '@/config/di/tokens';
import { inject, injectable } from 'tsyringe';
import type { IGetRunsUseCase } from '@/application/port/usecases/runs/getRuns.interface';
import type { AuthenticatedContext } from '@/presentation/http/macros/auth.macro';
import { GetRunsQueryInputSchema } from '@/application/dto/runs/getRuns.dto';
import { validate } from '../validator';
import type { IRunController } from '../interfaces/controller/runController.interface';
import type { IStreamRunLogsUseCase } from '@/application/port/usecases/runs/streamRunLogs.interface';
import { sse } from 'elysia';
import type { StreamRunLogsInputDTO, StreamRunLogsOutputDTO } from '@/application/dto/runs/streamRunLogs';

@injectable()
export class RunController implements IRunController {
	constructor(
		@inject(TOKENS.GetRunsUseCase)
		private readonly getRunsUseCase: IGetRunsUseCase,
		@inject(TOKENS.StreamRunLogsUseCase)
		private readonly streamRunLogsUseCase: IStreamRunLogsUseCase,
	) { }
	async *streamRunLogs(ctx: AuthenticatedContext) {
		const body = ctx.body as Omit<StreamRunLogsInputDTO, 'abort'>
		const gen = this.streamRunLogsUseCase.execute({
			// elysia giving build in abort controller else make one
			abort: ctx.request.signal,
			...body

		});

		for await (const event of gen) {
			yield sse<StreamRunLogsOutputDTO>({
				event: event.event, // 'status' or 'log'
				data: event.data,
				id: event.id,
			});
		}
	}

	getRuns = async (ctx: AuthenticatedContext) => {
		const query = validate(GetRunsQueryInputSchema, ctx.query);
		return this.getRunsUseCase.execute({
			req: ctx.user,
			query,
		});
	};
}
