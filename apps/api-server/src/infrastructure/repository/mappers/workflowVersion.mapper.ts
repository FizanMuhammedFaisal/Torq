import { WorkflowVersion } from '@/domain/entities/workflowVersions';
import type { IMapper } from '@/application/port/mappers/mapper.interface';
import type { workflowVersion } from '../database/schema';
import { injectable } from 'tsyringe';

type WorkflowVersionTable = typeof workflowVersion.$inferSelect;
type WorkflowVersionInsert = typeof workflowVersion.$inferInsert;

@injectable()
export class WorkflowVersionMapper
	implements IMapper<WorkflowVersion, WorkflowVersionInsert, WorkflowVersionTable> {
	toDomain(row: WorkflowVersionTable): WorkflowVersion {
		return WorkflowVersion.create({
			id: row.id,
			workflowId: row.workflowId,
			version: row.version,
			spec: row.spec,
			raw: row.raw,
			createdAt: row.createdAt,
			torqVersion: row.troqVersion,
		});
	}

	toPersistence(entity: WorkflowVersion): WorkflowVersionInsert {
		return {
			id: entity.id,
			workflowId: entity.workflowId,
			version: entity.version,
			spec: entity.spec,
			raw: entity.raw,
			createdAt: entity.createdAt,
			troqVersion: entity.torqVersion,
		};
	}
}
