import { TOKENS } from '@/config/di/tokens';
import { inject, injectable } from 'tsyringe';
import type { IGetRunsUseCase } from '@/application/port/usecases/runs/getRuns.interface';
import type { AuthenticatedContext } from '@/presentation/http/macros/auth.macro';
import { GetRunsQueryInputSchema } from '@/application/dto/runs/getRuns.dto';
import { validate } from '../validator';

@injectable()
export class RunController {
	constructor(
		@inject(TOKENS.GetRunsUseCase)
		private readonly getRunsUseCase: IGetRunsUseCase,
	) {}

	getRuns = async (ctx: AuthenticatedContext) => {
		const query = validate(GetRunsQueryInputSchema, ctx.query);
		return this.getRunsUseCase.execute({
			req: ctx.user,
			query,
		});
	};
}
