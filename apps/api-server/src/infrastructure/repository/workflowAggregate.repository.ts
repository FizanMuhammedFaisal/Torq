import { count, eq } from 'drizzle-orm';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import { getExecutor } from './database/transaction/transactionContext';
import { workflow as workflowSchema } from './database/schema';
import { WorkflowWithLatestRun } from '@/domain/entities/aggregates/workflowWithLatestRun';
import type { IWorkflowAggregateRepository } from '@/application/port/repositories/workflowAggregateRepository.interface';
import type { WorkflowMapper } from './mappers/workflow.mapper';
import type { WorkflowRunMapper } from './mappers/workflowRun.mapper';
import { PostgresErrorMapper } from './database/errors/postgresErrorMapper';

@injectable()
export class WorkflowAggregateRepository implements IWorkflowAggregateRepository {
	constructor(
		@inject(TOKENS.WorkflowMapper)
		private readonly workflowMapper: WorkflowMapper,
		@inject(TOKENS.WorkflowRunMapper)
		private readonly runMapper: WorkflowRunMapper,
	) {}
	async findCount(identityId: string): Promise<number> {
		try {
			const result = await getExecutor()
				.select({ total: count() })
				.from(workflowSchema)
				.where(eq(workflowSchema.identityId, identityId));

			return result[0]?.total ?? 0;
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Workflow' });
		}
	}
	async findAllWithLatestRun(
		identityId: string,
		limit: number,
		skip: number,
	): Promise<WorkflowWithLatestRun[]> {
		console.log(limit, skip);
		try {
			const result = await getExecutor().query.workflow.findMany({
				where: eq(workflowSchema.identityId, identityId),
				with: {
					runs: {
						orderBy: (run, { desc }) => [desc(run.startedAt)],
						limit: 1,
					},
				},
				orderBy: (wf, { desc }) => [desc(wf.createdAt)],
				limit,
				offset: skip,
			});

			return result.map((row) => {
				const workflow = this.workflowMapper.toDomain(row);
				const latestRunData = row.runs[0] || null;
				const latestRun = latestRunData ? this.runMapper.toDomain(latestRunData) : null;
				return WorkflowWithLatestRun.create({ workflow, latestRun });
			});
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'Workflow' });
		}
	}

	async findByIdWithLatestRun(id: string): Promise<WorkflowWithLatestRun | null> {
		try {
			const result = await getExecutor().query.workflow.findFirst({
				where: eq(workflowSchema.id, id),
				with: {
					runs: {
						orderBy: (run, { desc }) => [desc(run.startedAt)],
						limit: 1,
					},
				},
			});

			if (!result) return null;

			const workflow = this.workflowMapper.toDomain(result);
			const latestRunData = result.runs[0] || null;
			const latestRun = latestRunData ? this.runMapper.toDomain(latestRunData) : null;
			return WorkflowWithLatestRun.create({ workflow, latestRun });
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowAggregate' });
		}
	}
}
