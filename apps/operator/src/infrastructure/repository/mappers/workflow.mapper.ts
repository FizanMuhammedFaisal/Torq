import { Workflow } from '@/domain/entities/workflow';
import type { IMapper } from '@/application/port/mappers/mapper.interface';
import type { workflow } from '../database/schema';
import { injectable } from 'tsyringe';

type WorkflowTable = typeof workflow.$inferSelect;
type WorkflowInsert = typeof workflow.$inferInsert;

@injectable()
export class WorkflowMapper implements IMapper<Workflow, WorkflowInsert, WorkflowTable> {
	toDomain(row: WorkflowTable): Workflow {
		return Workflow.create({
			id: row.id,
			identityId: row.identityId,
			name: row.name,
			description: row.description,
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
