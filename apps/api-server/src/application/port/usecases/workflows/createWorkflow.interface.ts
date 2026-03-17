import type {
	CreateWorkflowInputDto,
	CreateWorkflowOutputDto,
} from '@/application/dto/worflows/createWorkflow.dto';

export interface ICreateWorkflowUseCase {
	execute: (data: CreateWorkflowInputDto) => Promise<CreateWorkflowOutputDto>;
}
