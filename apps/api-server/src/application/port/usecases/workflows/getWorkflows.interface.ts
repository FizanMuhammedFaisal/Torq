import type {
	GetWorkflowsInputDto,
	GetWorkflowsOutputDto,
} from '@/application/dto/worflows/getWorkflows.dto';

export interface IGetWorkflowsUseCase {
	execute(data: GetWorkflowsInputDto): Promise<GetWorkflowsOutputDto>;
}
