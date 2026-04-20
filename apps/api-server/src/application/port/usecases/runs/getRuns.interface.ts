import type { GetRunsInputDto, GetRunsOutputDto } from '@/application/dto/runs/getRuns.dto';

export interface IGetRunsUseCase {
	execute(data: GetRunsInputDto): Promise<GetRunsOutputDto>;
}
