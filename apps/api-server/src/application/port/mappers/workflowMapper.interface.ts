import type { Workflow } from '@/domain/entities/workflow';


export interface IWorkflowMapper<TRow = never, TInsert = never> {
    toDomain(row: TRow): Workflow;
    toPersistence(entity: Workflow): TInsert;
}
