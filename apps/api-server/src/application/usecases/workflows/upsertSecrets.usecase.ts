import { ulid } from 'ulid';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IUpsertSecretsUseCase } from '@/application/port/usecases/workflows/upsertSecrets.interface';
import type {
	UpsertSecretsInputDto,
	UpsertSecretsOutputDto,
} from '@/application/dto/worflows/upsertSecrets.dto';
import type { ISecrectRepository } from '@/application/port/repositories/secrectRepository.interface';
import type { ISecretManagementService } from '@/application/port/services/secretManagementService.interface';
import type { IUnitOfWork } from '@/application/port/repositories/unitOfWork.interface';
import { Secret } from '@/domain/entities/secrets';

@injectable()
export class UpsertSecretsUseCase implements IUpsertSecretsUseCase {
	constructor(
		@inject(TOKENS.SecretRepository) private secretRepository: ISecrectRepository,
		@inject(TOKENS.SecretManagementService)
		private secretManagementService: ISecretManagementService,
		@inject(TOKENS.UnitOfWork) private unitOfWork: IUnitOfWork,
	) {}

	async execute(data: UpsertSecretsInputDto): Promise<UpsertSecretsOutputDto> {
		const secretsParams = Array.isArray(data.secrets) ? data.secrets : [data.secrets];

		if (secretsParams.length === 0) {
			return { count: 0 };
		}

		await this.unitOfWork.execute(async () => {
			for (const secretParam of secretsParams) {
				const { ciphertext, iv, tag } = await this.secretManagementService.encryptSecret(
					secretParam.value,
				);

				const secretEntity = Secret.create({
					id: ulid(),
					workflowId: data.workflowId,
					key: secretParam.key,
					ciphertext,
					iv,
					tag,
					createdAt: new Date(),
					updatedAt: new Date(),
				});

				await this.secretRepository.save(secretEntity);
			}
		});

		return {
			count: secretsParams.length,
		};
	}
}
