import type { IUseCase } from '../usecases.interface';
import type { GetSecretsInputDto, GetSecretsOutputDto } from '@/application/dto/worflows/getSecrets.dto';

export interface IGetSecretsUseCase extends IUseCase<GetSecretsInputDto, GetSecretsOutputDto> {}
