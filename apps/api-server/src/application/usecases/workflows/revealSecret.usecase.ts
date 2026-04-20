import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { ISecrectRepository } from '@/application/port/repositories/secrectRepository.interface';
import type { IRevealSecretUseCase } from '@/application/port/usecases/workflows/revealSecret.interface';
import type { ISecretManagementService } from '@/application/port/services/secretManagementService.interface';
import type {
	RevealSecretInputDto,
	RevealSecretOutputDto,
} from '@/application/dto/worflows/revealSecret.dto';
import { NotFoundError } from '@/domain/errors/notFoundError';

@injectable()
export class RevealSecretUseCase implements IRevealSecretUseCase {
	constructor(
		@inject(TOKENS.SecretRepository)
		private readonly secretRepository: ISecrectRepository,
		@inject(TOKENS.SecretManagementService)
		private readonly secretService: ISecretManagementService,
	) {}

	async execute(data: RevealSecretInputDto): Promise<RevealSecretOutputDto> {
		const secrets = await this.secretRepository.findByWorkflowId(data.id);
		const secret = secrets.find((s) => s.key === data.key);

		if (!secret) {
			throw new NotFoundError('Secrect');
		}

		const value = await this.secretService.decryptSecret({
			ciphertext: secret.ciphertext,
			iv: secret.iv,
			tag: secret.tag,
		});

		return { key: secret.key, value };
	}
}
