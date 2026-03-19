import { eq } from 'drizzle-orm';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import { getExecutor } from './database/transaction/transactionContext';
import { workflow } from './database/schema';
import { WorkflowWithLatestRun } from '@/domain/entities/workflowWithLatestRun';
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
	) { }

	async findAllWithLatestRun(identityId: string): Promise<WorkflowWithLatestRun[]> {
		try {
			const result = await getExecutor().query.workflow.findMany({
				where: eq(workflow.identityId, identityId),
				with: {
					runs: {
						orderBy: (run, { desc }) => [desc(run.startedAt)],
						limit: 1,
					},
				},
				orderBy: (wf, { desc }) => [desc(wf.createdAt)],
			});

			return result.map((row) => {
				const domainWf = this.workflowMapper.toDomain(row);
				const latestRunData = row.runs[0] || null;
				const latestRun = latestRunData ? this.runMapper.toDomain(latestRunData) : null;
				return new WorkflowWithLatestRun(domainWf, latestRun);
			});
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowAggregate' });
		}
	}

	async findByIdWithLatestRun(id: string): Promise<WorkflowWithLatestRun | null> {
		try {
			const result = await getExecutor().query.workflow.findFirst({
				where: eq(workflow.id, id),
				with: {
					runs: {
						orderBy: (run, { desc }) => [desc(run.startedAt)],
						limit: 1,
					},
				},
			});

			if (!result) return null;

			const domainWf = this.workflowMapper.toDomain(result);
			const latestRunData = result.runs[0] || null;
			const latestRun = latestRunData ? this.runMapper.toDomain(latestRunData) : null;
			return new WorkflowWithLatestRun(domainWf, latestRun);
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowAggregate' });
		}
	}
}
