import type { WorkflowRun } from '@/domain/entities/workflowRun';


export interface IWorkflowRunMapper<TRow = never, TInsert = never> {
    toDomain(row: TRow): WorkflowRun;
    toPersistence(entity: WorkflowRun): TInsert;
}
