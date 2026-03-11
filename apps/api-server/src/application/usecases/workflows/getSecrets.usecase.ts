import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { ISecrectRepository } from '@/application/port/repositories/secrectRepository.interface';
import type { IGetSecretsUseCase } from '@/application/port/usecases/workflows/getSecrets.interface';
import type { GetSecretsInputDto, GetSecretsOutputDto } from '@/application/dto/worflows/getSecrets.dto';

@injectable()
export class GetSecretsUseCase implements IGetSecretsUseCase {
	constructor(
		@inject(TOKENS.SecretRepository)
		private readonly secretRepository: ISecrectRepository,
	) {}

	async execute(data: GetSecretsInputDto): Promise<GetSecretsOutputDto> {
		const secrets = await this.secretRepository.findByWorkflowId(data.workflowId);
		
		return secrets.map(secret => ({
			id: secret.id as string,
			key: secret.key,
			createdAt: secret.createdAt as Date,
			updatedAt: secret.updatedAt as Date,
		}));
	}
}
