import { eq } from 'drizzle-orm';
import type { ISecrectRepository } from '@application/port/repositories/secrectRepository.interface';
import type { Secret } from '@domain/entities/secrets';
import { getExecutor } from './database/transaction/transactionContext';
import { secrets } from './database/schema';
import type { SecretMapper } from './mappers/secret.mapper';
import { PostgresErrorMapper } from './database/errors/postgresErrorMapper';
import { DatabaseInternalError } from '@infrastructure/errors/databaseInternalError';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';

@injectable()
export class SecrectRepository implements ISecrectRepository {
	constructor(
		@inject(TOKENS.SecretMapper)
		private readonly mapper: SecretMapper,
	) { }

	async findById(id: string): Promise<Secret | null> {
		try {
			const result = await getExecutor().query.secrets.findFirst({
				where: eq(secrets.id, id),
			});

			if (!result) return null;

			return this.mapper.toDomain(result);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Secret' });
		}
	}

	async save(entity: Secret): Promise<Secret> {
		try {
			const persistenceModel = this.mapper.toPersistence(entity);
			const result = await getExecutor()
				.insert(secrets)
				.values(persistenceModel)
				.onConflictDoUpdate({
					target: secrets.id,
					set: {
						workflowId: entity.workflowId,
						key: entity.key,
						ciphertext: entity.ciphertext,
						iv: entity.iv,
						tag: entity.tag,
						updatedAt: new Date(),
					},
				})
				.returning();

			const row = result[0];
			if (!row) throw new DatabaseInternalError('Failed to save secret');

			return this.mapper.toDomain(row);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Secret' });
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await getExecutor().delete(secrets).where(eq(secrets.id, id));
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Secret' });
		}
	}

	async existsById(id: string): Promise<boolean> {
		try {
			const result = await getExecutor().query.secrets.findFirst({
				columns: { id: true },
				where: eq(secrets.id, id),
			});
			return !!result;
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Secret' });
		}
	}
}
