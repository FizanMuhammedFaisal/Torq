import { injectable, inject } from 'tsyringe';
import type { ICreateRunUseCase } from '@/application/port/usecases/workflows/createRun.interface';
import type {
	CreateRunInputDto,
	CreateRunOutputDto,
} from '@/application/dto/worflows/createRun.dto';
import { TOKENS } from '@/config/di/tokens';
import type { WorkflowRunRepository } from '@/infrastructure/repository/workflowRun.repository';

@injectable()
export class CreateRunUseCase implements ICreateRunUseCase {
	constructor(
		@inject(TOKENS.WorkflowRunRepository)
		private readonly workflowRunRepository: WorkflowRunRepository,
	) {}

	async execute(data: CreateRunInputDto): Promise<CreateRunOutputDto> {
		return this.workflowRunRepository.createRun(data);
	}
}
