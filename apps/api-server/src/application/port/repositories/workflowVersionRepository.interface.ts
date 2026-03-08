import type { IBaseRepository } from './baseRepository.interface';
import type { WorkflowVersion } from '@/domain/entities/workflowVersions';

export interface IWorkflowVersionRepository extends IBaseRepository<WorkflowVersion> {}
