import type {
	RevealSecretInputDto,
	RevealSecretOutputDto,
} from '@/application/dto/worflows/revealSecret.dto';

export interface IRevealSecretUseCase {
	execute(data: RevealSecretInputDto): Promise<RevealSecretOutputDto>;
}
