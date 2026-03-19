import { injectable, inject } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type {
	IGetWorkflowByIdUseCase,
} from '@/application/port/usecases/workflows/getWorkflowById.interface';
import type {
	GetWorkflowByIdInputDto,
	GetWorkflowByIdOutputDto,
} from '@/application/dto/worflows/getWorkflowById.dto';
import type { IWorkflowAggregateRepository } from '@/application/port/repositories/workflowAggregateRepository.interface';
import { ResourceNotFoundError } from '@/application/errors/resourceNotFound.error';

@injectable()
export class GetWorkflowByIdUseCase implements IGetWorkflowByIdUseCase {
	constructor(
		@inject(TOKENS.WorkflowAggregateRepository)
		private readonly aggregateRepository: IWorkflowAggregateRepository,
	) { }

	async execute(input: GetWorkflowByIdInputDto): Promise<GetWorkflowByIdOutputDto> {
		const aggregate = await this.aggregateRepository.findByIdWithLatestRun(input.id);

		if (!aggregate) {
			throw new ResourceNotFoundError('Workflow', input.id);
		}

		return {
			id: aggregate.workflow.id,
			name: aggregate.workflow.name,
			description: aggregate.workflow.description,
			createdAt: aggregate.workflow.createdAt,
			status: aggregate.status as GetWorkflowByIdOutputDto['status'],
		};
	}
}
