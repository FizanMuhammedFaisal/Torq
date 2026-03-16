import type { Workflow } from '@/domain/entities/workflow';
import type { IBaseRepository } from './baseRepository.interface';
export interface WorkflowWithRuns extends Workflow {
	runs: {
		id: string;
		status: 'running' | 'success' | 'failed' | 'idle';
		startedAt: Date;
		completedAt: Date | null;
		duration: number | null;
		steps: number;
	}[];
}

export interface IWorkflowRepository extends IBaseRepository<Workflow> {
	getWorkflowsWithRuns(identityId: string, limitRuns: number): Promise<WorkflowWithRuns[]>;
}
