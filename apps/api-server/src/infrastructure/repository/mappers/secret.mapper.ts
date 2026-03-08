import { Secret } from '@/domain/entities/secrets';
import type { IMapper } from '@/application/port/mappers/mapper.interface';
import type { secrets } from '../database/schema';

import { injectable } from 'tsyringe';

type SecretTable = typeof secrets.$inferSelect;
type SecretInsert = typeof secrets.$inferInsert;

@injectable()
export class SecretMapper implements IMapper<Secret, SecretInsert, SecretTable> {
	toDomain(row: SecretTable): Secret {
		return Secret.create({
			id: row.id,
			workflowId: row.workflowId,
			key: row.key,
			ciphertext: row.ciphertext,
			iv: row.iv,
			tag: row.tag,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
		});
	}

	toPersistence(entity: Secret): SecretInsert {
		return {
			id: entity.id,
			workflowId: entity.workflowId,
			key: entity.key,
			ciphertext: entity.ciphertext,
			iv: entity.iv,
			tag: entity.tag,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}
