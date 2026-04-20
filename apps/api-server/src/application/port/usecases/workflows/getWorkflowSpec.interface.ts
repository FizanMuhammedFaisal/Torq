import type {
	GetWorkflowSpecInput,
	GetWorkflowSpecOutput,
} from '@/application/dto/worflows/getWorkflowSpec.dto';
import type { IUseCase } from '../usecases.interface';

export interface IGetWorkflowSpecUseCase
	extends IUseCase<GetWorkflowSpecInput, GetWorkflowSpecOutput> {}
