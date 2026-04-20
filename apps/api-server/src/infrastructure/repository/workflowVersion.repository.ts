import { eq, desc, and } from 'drizzle-orm';
import type { IWorkflowVersionRepository } from '@application/port/repositories/workflowVersionRepository.interface';
import type { WorkflowVersion } from '@domain/entities/workflowVersions';
import { getExecutor } from './database/transaction/transactionContext';
import { workflowVersion } from './database/schema';
import type { WorkflowVersionMapper } from './mappers/workflowVersion.mapper';
import { PostgresErrorMapper } from './database/errors/postgresErrorMapper';
import { DatabaseInternalError } from '@infrastructure/errors/databaseInternalError';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';

@injectable()
export class WorkflowVersionRepository implements IWorkflowVersionRepository {
	constructor(
		@inject(TOKENS.WorkflowVersionMapper)
		private readonly mapper: WorkflowVersionMapper,
	) {}

	async findLatestByWorkflowId(workflowId: string): Promise<WorkflowVersion | null> {
		try {
			const result = await getExecutor().query.workflowVersion.findFirst({
				where: eq(workflowVersion.workflowId, workflowId),
				orderBy: desc(workflowVersion.version),
			});

			if (!result) return null;

			return this.mapper.toDomain(result);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowVersion' });
		}
	}

	async findByWorkflowIdAndVersion(
		workflowId: string,
		version: number,
	): Promise<WorkflowVersion | null> {
		try {
			const result = await getExecutor().query.workflowVersion.findFirst({
				where: and(
					eq(workflowVersion.workflowId, workflowId),
					eq(workflowVersion.version, version),
				),
			});

			if (!result) return null;

			return this.mapper.toDomain(result);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowVersion' });
		}
	}

	async findById(id: string): Promise<WorkflowVersion | null> {
		try {
			const result = await getExecutor().query.workflowVersion.findFirst({
				where: eq(workflowVersion.id, id),
			});

			if (!result) return null;

			return this.mapper.toDomain(result);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowVersion' });
		}
	}

	async save(entity: WorkflowVersion): Promise<WorkflowVersion> {
		try {
			const persistenceModel = this.mapper.toPersistence(entity);
			const result = await getExecutor()
				.insert(workflowVersion)
				.values(persistenceModel)
				.onConflictDoUpdate({
					target: workflowVersion.id,
					set: {
						workflowId: entity.workflowId,
						version: entity.version,
						troqVersion: entity.torqVersion,
						id: entity.id,
						createdAt: entity.createdAt,
						spec: entity.spec,
						raw: entity.raw,
					},
				})
				.returning();

			const row = result[0];
			if (!row) throw new DatabaseInternalError('Failed to save workflow version');

			return this.mapper.toDomain(row);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowVersion' });
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await getExecutor().delete(workflowVersion).where(eq(workflowVersion.id, id));
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowVersion' });
		}
	}

	async existsById(id: string): Promise<boolean> {
		try {
			const result = await getExecutor().query.workflowVersion.findFirst({
				columns: { id: true },
				where: eq(workflowVersion.id, id),
			});
			return !!result;
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowVersion' });
		}
	}
}
