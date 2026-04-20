import { eq } from 'drizzle-orm';
import type { IWorkflowRepository } from '@application/port/repositories/workflowRepository.interface';
import type { Workflow } from '@domain/entities/workflow';
import { getExecutor } from './database/transaction/transactionContext';
import { workflow } from './database/schema';
import type { WorkflowMapper } from './mappers/workflow.mapper';
import { PostgresErrorMapper } from './database/errors/postgresErrorMapper';
import { DatabaseInternalError } from '@infrastructure/errors/databaseInternalError';

import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';

@injectable()
export class WorkflowRepository implements IWorkflowRepository {
	constructor(
		@inject(TOKENS.WorkflowMapper)
		private readonly mapper: WorkflowMapper,
	) {}

	async findById(id: string): Promise<Workflow | null> {
		try {
			const result = await getExecutor().query.workflow.findFirst({
				where: eq(workflow.id, id),
			});

			if (!result) return null;

			return this.mapper.toDomain(result);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Workflow' });
		}
	}

	async findByIdentityId(identityId: string): Promise<Workflow[]> {
		try {
			const result = await getExecutor().query.workflow.findMany({
				where: eq(workflow.identityId, identityId),
				orderBy: (wf, { desc }) => [desc(wf.createdAt)],
			});

			return result.map((row) => this.mapper.toDomain(row));
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Workflow' });
		}
	}

	async save(entity: Workflow): Promise<Workflow> {
		try {
			const persistenceModel = this.mapper.toPersistence(entity);
			const result = await getExecutor()
				.insert(workflow)
				.values(persistenceModel)
				.onConflictDoUpdate({
					target: workflow.id,
					set: {
						name: entity.name,
						description: entity.description,
						identityId: entity.identityId,
					},
				})
				.returning();

			const row = result[0];
			if (!row) throw new DatabaseInternalError('Failed to save workflow');

			return this.mapper.toDomain(row);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Workflow' });
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await getExecutor().delete(workflow).where(eq(workflow.id, id));
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Workflow' });
		}
	}

	async existsById(id: string): Promise<boolean> {
		try {
			const result = await getExecutor().query.workflow.findFirst({
				columns: { id: true },
				where: eq(workflow.id, id),
			});
			return !!result;
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Workflow' });
		}
	}
}
