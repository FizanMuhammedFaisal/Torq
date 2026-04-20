import { injectable, inject } from 'tsyringe';
import { ulid } from 'ulid';
import { eq, desc, and, ilike, count } from 'drizzle-orm';
import { getExecutor } from './database/transaction/transactionContext';
import { workflowRun, workflow } from './database/schema';
import { PostgresErrorMapper } from './database/errors/postgresErrorMapper';
import { DatabaseInternalError } from '@infrastructure/errors/databaseInternalError';
import type {
	IWorkflowRunRepository,
	PersistRunDto,
} from '@/application/port/repositories/workflowRunRepository.interface';
import type { WorkflowRun, RunStatus } from '@/domain/entities/workflowRun';
import type { WorkflowRunMapper } from './mappers/workflowRun.mapper';
import { TOKENS } from '@/config/di/tokens';
import { logger } from '../logger/logger';

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

	async updateRunState(
		runId: string,
		status?: string,
		stepName?: string,
		ts?: Date,
	): Promise<void> {
		try {
			const executor = getExecutor();
			const targetRun = await executor.query.workflowRun.findFirst({
				where: eq(workflowRun.id, runId),
			});

			if (!targetRun) {
				logger.warn(
					{ runId },
					'[WorkflowRunRepository] updateRunState: Target run not found in database',
				);
				return;
			}

			const updateData: any = {};
			const eventTs = ts ? ts.getTime() : Date.now();

			// Pre-check for twargetRun status to avoid reverting from terminal states
			const isWorkflowTerminal = ['SUCCESS', 'FAILED'].includes(targetRun.status);

			if (!stepName && status) {
				// Don't modify overall workflow status if it's already terminal
				if (!isWorkflowTerminal) {
					updateData.status = status;
					if (['SUCCESS', 'FAILED'].includes(status)) {
						updateData.completedAt = ts || new Date();
					}
				}
			} else if (stepName && status) {
				const existingSteps =
					(targetRun.steps as Record<string, { status: string; ts?: number }>) || {};
				const existingStep = existingSteps[stepName];

				// Only update the step if we have newer information
				if (!existingStep || !existingStep.ts || eventTs > existingStep.ts) {
					updateData.steps = {
						...existingSteps,
						[stepName]: { status, ts: eventTs },
					};
				}
			}

			if (Object.keys(updateData).length > 0) {
				await executor.update(workflowRun).set(updateData).where(eq(workflowRun.id, targetRun.id));
			}
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

	async findAllPaged(options: {
		userId: string;
		page: number;
		pageSize: number;
		search?: string;
		workflowId?: string;
	}): Promise<{ runs: (WorkflowRun & { workflowName: string })[]; total: number }> {
		try {
			const offset = (options.page - 1) * options.pageSize;
			const executor = getExecutor();

			const whereClause = and(
				eq(workflow.identityId, options.userId),
				options.search ? ilike(workflow.name, `%${options.search}%`) : undefined,
				options.workflowId ? eq(workflowRun.workflowId, options.workflowId) : undefined,
			);

			const results = await executor
				.select({
					run: workflowRun,
					workflowName: workflow.name,
				})
				.from(workflowRun)
				.innerJoin(workflow, eq(workflowRun.workflowId, workflow.id))
				.where(whereClause)
				.orderBy(desc(workflowRun.startedAt))
				.limit(options.pageSize)
				.offset(offset);

			const totalResult = await executor
				.select({ count: count() })
				.from(workflowRun)
				.innerJoin(workflow, eq(workflowRun.workflowId, workflow.id))
				.where(whereClause);

			const total = totalResult[0]?.count ?? 0;

			const mappedRuns = results.map((row) => {
				const domainRun = this.mapper.toDomain(row.run);
				return Object.assign(domainRun, { workflowName: row.workflowName });
			});

			return { runs: mappedRuns, total };
		} catch (error) {
			throw PostgresErrorMapper.mapError(error, { entity: 'WorkflowRun' });
		}
	}
}
