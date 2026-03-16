import type {
	GetSecretsInputDto,
	GetSecretsOutputDto,
} from '@/application/dto/worflows/getSecrets.dto';
import type { IUseCase } from '../usecases.interface';

export interface IGetSecretsUseCase extends IUseCase<GetSecretsInputDto, GetSecretsOutputDto> {}
