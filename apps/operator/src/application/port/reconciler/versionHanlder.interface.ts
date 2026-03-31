import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';

export interface IVersionHanlder {
    reconcile(run: WorkflowRunSnapshot): Promise<void>
}
