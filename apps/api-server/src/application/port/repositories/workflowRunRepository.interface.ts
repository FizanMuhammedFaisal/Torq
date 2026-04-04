import type {
	WorkflowRun,
	RunStatus,
	TriggerType,
} from '@/domain/entities/workflowRun';
import type { IBaseRepository } from './baseRepository.interface';

export type PersistRunDto = {
	status: RunStatus;
	startedAt?: string;
	completedAt?: string | null;
	duration?: number | null;
	workflowId: string;
	workflowVersionId: string;
	identityId: string;
	triggerType: TriggerType;
	triggeredBy: string;
};

export interface IWorkflowRunRepository extends IBaseRepository<WorkflowRun> {
	create(data: PersistRunDto): Promise<WorkflowRun>;
	updateStatus(id: string, status: RunStatus): Promise<void>;
	findByWorkflowId(workflowId: string, options?: { limit?: number }): Promise<WorkflowRun[]>;
}
