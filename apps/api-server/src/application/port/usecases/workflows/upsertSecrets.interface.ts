import type {
	UpsertSecretsInputDto,
	UpsertSecretsOutputDto,
} from '@/application/dto/worflows/upsertSecrets.dto';

export interface IUpsertSecretsUseCase {
	execute(data: UpsertSecretsInputDto): Promise<UpsertSecretsOutputDto>;
}
