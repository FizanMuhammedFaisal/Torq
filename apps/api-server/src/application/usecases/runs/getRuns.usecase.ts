import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowRunRepository } from '@/application/port/repositories/workflowRunRepository.interface';
import type { IGetRunsUseCase } from '@/application/port/usecases/runs/getRuns.interface';
import type { GetRunsInputDto, GetRunsOutputDto, RunDto } from '@/application/dto/runs/getRuns.dto';

@injectable()
export class GetRunsUseCase implements IGetRunsUseCase {
	constructor(
		@inject(TOKENS.WorkflowRunRepository)
		private readonly workflowRunRepository: IWorkflowRunRepository,
	) {}

	async execute(data: GetRunsInputDto): Promise<GetRunsOutputDto> {
		const { req, query } = data;
		const { page, pageSize, search, workflowId } = query;

		const { runs, total } = await this.workflowRunRepository.findAllPaged({
			userId: req.id,
			page,
			pageSize,
			search,
			workflowId,
		});

		const mappedRuns: RunDto[] = runs.map((run) => ({
			id: run.id,
			workflowId: run.workflowId,
			workflowName: run.workflowName,
			status: run.status,
			trigger: run.triggerType,
			startedAt: run.startedAt.toISOString(),
			completedAt: run.completedAt?.toISOString(),
			durationMs: run.duration ?? undefined,
			namespace: 'default', // Default for now
			stepCount: Object.keys(run.steps).length,
			steps: run.steps as Record<string, { status: string; ts?: number }>,
		}));

		return {
			data: mappedRuns,
			meta: {
				totalItems: total,
				page,
				pageSize,
				totalPages: Math.ceil(total / pageSize),
			},
		};
	}
}
