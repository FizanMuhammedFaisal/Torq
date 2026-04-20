import type {
	GetWorkflowRunInputDto,
	GetWorkflowRunOutputDto,
} from '@/application/dto/worflows/getWorkflowRun.dto';
import type { IUseCase } from '../usecases.interface';

export interface IGetWorkflowRunsUseCase
	extends IUseCase<GetWorkflowRunInputDto, GetWorkflowRunOutputDto> {}
