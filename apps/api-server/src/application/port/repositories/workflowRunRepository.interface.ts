import type {
	WorkflowRun,
	WorkflowRunStatus,
	WorkflowTriggerType,
} from '@/domain/entities/workflowRun';
import type { IBaseRepository } from './baseRepository.interface';

export type PersistRunDto = {
	status: WorkflowRunStatus;
	startedAt?: string;
	completedAt?: string | null;
	duration?: number | null;
	workflowId: string;
	workflowVersionId: string;
	identityId: string;
	triggerType: WorkflowTriggerType;
	triggeredBy: string;
};

export interface IWorkflowRunRepository extends IBaseRepository<WorkflowRun> {
	create(data: PersistRunDto): Promise<WorkflowRun>;
	updateStatus(id: string, status: WorkflowRunStatus): Promise<void>;
	findByWorkflowId(workflowId: string, options?: { limit?: number }): Promise<WorkflowRun[]>;
}
