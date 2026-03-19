import { Workflow } from '@/domain/entities/workflow';
import type { IWorkflowMapper } from '@/application/port/mappers/workflowMapper.interface';
import type { workflow } from '../database/schema';
import { injectable } from 'tsyringe';

type WorkflowTable = typeof workflow.$inferSelect;
type WorkflowInsert = typeof workflow.$inferInsert;

@injectable()
export class WorkflowMapper implements IWorkflowMapper<WorkflowTable, WorkflowInsert> {
	toDomain(row: WorkflowTable): Workflow {
		return Workflow.create({
			id: row.id,
			identityId: row.identityId,
			name: row.name,
			description: row.description ?? undefined,
			createdAt: row.createdAt,
		});
	}

	toPersistence(entity: Workflow): WorkflowInsert {
		return {
			id: entity.id,
			identityId: entity.identityId,
			name: entity.name,
			description: entity.description,
			createdAt: entity.createdAt,
		};
	}
}
