import { injectable } from 'tsyringe';
import { ulid } from 'ulid';
import { eq } from 'drizzle-orm';
import { getExecutor } from './database/transaction/transactionContext';
import { workflowRun } from './database/schema';
import { PostgresErrorMapper } from './database/errors/postgresErrorMapper';
import { DatabaseInternalError } from '@infrastructure/errors/databaseInternalError';
import type { IWorkflowRunRepository, PersistRunDto, PersistedRunDto, RunStatus } from '@/application/port/repositories/workflowRunRepository.interface';
import { RUN_STATUS } from '@/application/port/repositories/workflowRunRepository.interface';

@injectable()
export class WorkflowRunRepository implements IWorkflowRunRepository {
	async createRun(data: PersistRunDto): Promise<PersistedRunDto> {
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
					steps: data.steps,
				})
				.returning();

			const row = result[0];
			if (!row) throw new DatabaseInternalError('Failed to create workflow run');

			return {
				id: row.id,
				workflowId: row.workflowId,
				workflowVersionId: row.workflowVersionId,
				status: row.status as PersistedRunDto['status'],
				triggerType: row.triggerType as PersistedRunDto['triggerType'],
				triggeredBy: row.triggeredBy,
				startedAt: row.startedAt,
				completedAt: row.completedAt,
				duration: row.duration,
				steps: row.steps,
			};
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowRun' });
		}
	}

	async updateRunStatus(id: string, status: RunStatus): Promise<void> {
		try {
			await getExecutor()
				.update(workflowRun)
				.set({
					status,
					completedAt: status === RUN_STATUS.FAILED || status === RUN_STATUS.SUCCESS ? new Date() : null,
				})
				.where(eq(workflowRun.id, id));
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowRun' });
		}
	}
}
