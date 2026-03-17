import { injectable } from 'tsyringe';
import { ulid } from 'ulid';
import { getExecutor } from './database/transaction/transactionContext';
import { workflowRun } from './database/schema';
import { PostgresErrorMapper } from './database/errors/postgresErrorMapper';
import { DatabaseInternalError } from '@infrastructure/errors/databaseInternalError';
import type {
	CreateRunInputDto,
	CreateRunOutputDto,
} from '@/application/dto/worflows/createRun.dto';

@injectable()
export class WorkflowRunRepository {
	async createRun(data: CreateRunInputDto): Promise<CreateRunOutputDto> {
		try {
			const id = ulid();
			const startedAt = data.startedAt ? new Date(data.startedAt) : new Date();
			const completedAt = data.completedAt ? new Date(data.completedAt) : null;

			const result = await getExecutor()
				.insert(workflowRun)
				.values({
					id,
					workflowId: data.workflowId,
					status: data.status,
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
				status: row.status as CreateRunOutputDto['status'],
				startedAt: row.startedAt,
				completedAt: row.completedAt,
				duration: row.duration,
				steps: row.steps,
			};
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowRun' });
		}
	}
}
