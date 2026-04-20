import type {
	GetWorkflowByIdInputDto,
	GetWorkflowByIdOutputDto,
} from '@/application/dto/worflows/getWorkflowById.dto';

export interface IGetWorkflowByIdUseCase {
	execute(input: GetWorkflowByIdInputDto): Promise<GetWorkflowByIdOutputDto>;
}
