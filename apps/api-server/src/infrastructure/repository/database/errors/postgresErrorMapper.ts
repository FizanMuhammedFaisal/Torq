import { DatabaseInternalError } from '@infrastructure/errors/databaseInternalError';
import { ConflictError } from '@domain/errors/conflictError';
import type { DomainError } from '@domain/errors/domainError.abstract';
import type { InfraError } from '@infrastructure/errors/infraError.abstract';

export class PostgresErrorMapper {
	static mapError(error: unknown, context: { entity: string }): DomainError | InfraError {
		const pgError = error as { code?: string; message?: string };
		// Postgres unique violation error code
		if (pgError?.code === '23505') {
			return new ConflictError(`${context.entity} already exists (duplicate key)`);
		}

		// Foreign key violation
		if (pgError?.code === '23503') {
			return new ConflictError(`Related record for ${context.entity} not found or protected`);
		}

		// Not null violation
		if (pgError?.code === '23502') {
			return new DatabaseInternalError(`Missing required data for ${context.entity}`);
		}

		// Default to internal database error. Avoid leaking the postgres error message/query.
		return new DatabaseInternalError(`An error occurred while accessing ${context.entity}`);
	}
}
