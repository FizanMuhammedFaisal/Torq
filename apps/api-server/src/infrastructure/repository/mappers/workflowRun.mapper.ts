import { WorkflowRun } from '@/domain/entities/workflowRun';
import type { IWorkflowRunMapper } from '@/application/port/mappers/workflowRunMapper.interface';
import type { workflowRun } from '../database/schema';
import { injectable } from 'tsyringe';

type WorkflowRunTable = typeof workflowRun.$inferSelect;
type WorkflowRunInsert = typeof workflowRun.$inferInsert;

@injectable()
export class WorkflowRunMapper implements IWorkflowRunMapper<WorkflowRunTable, WorkflowRunInsert> {
	toDomain(row: WorkflowRunTable): WorkflowRun {
		return WorkflowRun.create({
			id: row.id,
			workflowId: row.workflowId,
			workflowVersionId: row.workflowVersionId,
			status: row.status,
			triggerType: row.triggerType,
			triggeredBy: row.triggeredBy,
			startedAt: row.startedAt,
			completedAt: row.completedAt,
			duration: row.duration,
		});
	}

	toPersistence(entity: WorkflowRun): WorkflowRunInsert {
		return {
			id: entity.id,
			workflowId: entity.workflowId,
			workflowVersionId: entity.workflowVersionId,
			status: entity.status,
			triggerType: entity.triggerType,
			triggeredBy: entity.triggeredBy,
			startedAt: entity.startedAt,
			completedAt: entity.completedAt,
			duration: entity.duration,
		};
	}
}
