import { injectable, inject } from 'tsyringe';
import { ulid } from 'ulid';
import { eq, desc } from 'drizzle-orm';
import { getExecutor } from './database/transaction/transactionContext';
import { workflowRun } from './database/schema';
import { PostgresErrorMapper } from './database/errors/postgresErrorMapper';
import { DatabaseInternalError } from '@infrastructure/errors/databaseInternalError';
import type {
	IWorkflowRunRepository,
	PersistRunDto,
} from '@/application/port/repositories/workflowRunRepository.interface';
import type { WorkflowRun, RunStatus } from '@/domain/entities/workflowRun';
import type { WorkflowRunMapper } from './mappers/workflowRun.mapper';
import { TOKENS } from '@/config/di/tokens';

@injectable()
export class WorkflowRunRepository implements IWorkflowRunRepository {
	constructor(
		@inject(TOKENS.WorkflowRunMapper)
		private readonly mapper: WorkflowRunMapper,
	) {}

	async create(data: PersistRunDto): Promise<WorkflowRun> {
		try {
			const id = ulid();
			const startedAt = data.startedAt ? new Date(data.startedAt) : new Date();
			const completedAt = data.completedAt ? new Date(data.completedAt) : null;

			const result = await getExecutor()
				.insert(workflowRun)
				.values({
					id,
					workflowId: data.workflowId,
					workflowVersionId: data.workflowVersionId,
					status: data.status,
					triggerType: data.triggerType,
					triggeredBy: data.triggeredBy,
					startedAt,
					completedAt,
					duration: data.duration ?? null,
				})
				.returning();

			const row = result[0];
			if (!row) throw new DatabaseInternalError('Failed to create workflow run');

			return this.mapper.toDomain(row);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowRun' });
		}
	}

	async updateStatus(id: string, status: RunStatus): Promise<void> {
		try {
			await getExecutor()
				.update(workflowRun)
				.set({
					status,
					completedAt: status === 'FAILED' || status === 'SUCCESS' ? new Date() : null,
				})
				.where(eq(workflowRun.id, id));
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowRun' });
		}
	}

	async findByWorkflowId(workflowId: string, options?: { limit?: number }): Promise<WorkflowRun[]> {
		try {
			const results = await getExecutor().query.workflowRun.findMany({
				where: eq(workflowRun.workflowId, workflowId),
				orderBy: [desc(workflowRun.startedAt)],
				limit: options?.limit,
			});

			return results.map((row) => this.mapper.toDomain(row));
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowRun' });
		}
	}

	async findById(id: string): Promise<WorkflowRun | null> {
		try {
			const result = await getExecutor().query.workflowRun.findFirst({
				where: eq(workflowRun.id, id),
			});

			if (!result) return null;

			return this.mapper.toDomain(result);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowRun' });
		}
	}

	/**
	 * Runs are immutable after creation — only their status can be updated via updateStatus().
	 */
	async save(_entity: WorkflowRun): Promise<WorkflowRun> {
		throw new Error('WorkflowRun is immutable — use create() or updateStatus() instead.');
	}

	async delete(id: string): Promise<void> {
		try {
			await getExecutor().delete(workflowRun).where(eq(workflowRun.id, id));
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowRun' });
		}
	}

	async existsById(id: string): Promise<boolean> {
		try {
			const result = await getExecutor().query.workflowRun.findFirst({
				columns: { id: true },
				where: eq(workflowRun.id, id),
			});
			return !!result;
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowRun' });
		}
	}
}
