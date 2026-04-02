import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IGetWorkflowsUseCase } from '@/application/port/usecases/workflows/getWorkflows.interface';
import type { IWorkflowAggregateRepository } from '@/application/port/repositories/workflowAggregateRepository.interface';
import type {
	GetWorkflowsInputDto,
	GetWorkflowsOutputDto,
	WorkflowRunStatus,
} from '@/application/dto/worflows/getWorkflows.dto';

@injectable()
export class GetWorkflowsUseCase implements IGetWorkflowsUseCase {
	constructor(
		@inject(TOKENS.WorkflowAggregateRepository)
		private readonly aggregateRepository: IWorkflowAggregateRepository,
	) { }

	async execute(data: GetWorkflowsInputDto): Promise<GetWorkflowsOutputDto> {

		const skip = (data.query.pageSize ?? 20) * ((data.query.page ?? 1) - 1);
		const limit = data.query.pageSize ?? 20;
		const aggregates = await this.aggregateRepository.findAllWithLatestRun(data.req.id, limit, skip);
		const count = await this.aggregateRepository.findCount(data.req.id);

		const workflows = aggregates.map((agg) => {
			const lastRun = agg.latestRun;

			return {
				id: agg.workflow.id,
				name: agg.workflow.name,
				description: agg.workflow.description,
				createdAt: agg.workflow.createdAt,
				health: [],
				lastRun: lastRun
					?
					{
						status: lastRun.status as WorkflowRunStatus,
						startedAt: lastRun.startedAt,
						completedAt: lastRun.completedAt,
						duration: lastRun.duration,
					} : null,
			};
		});

		return {
			workflows, meta: {
				page: data.query.page ?? 1,
				pageSize: data.query.pageSize ?? 20,
				totalItems: count,
				totalPages: Math.ceil(count / (data.query.pageSize ?? 20)),

			}
		};
	}
}
