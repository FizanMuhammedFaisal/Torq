import type {
	CreateRunInputDto,
	CreateRunOutputDto,
} from '@/application/dto/worflows/createRun.dto';

export interface ICreateRunUseCase {
	execute(data: CreateRunInputDto): Promise<CreateRunOutputDto>;
}
