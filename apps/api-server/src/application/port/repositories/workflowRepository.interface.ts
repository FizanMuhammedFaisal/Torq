import type { Workflow } from '@/domain/entities/workflow';
import type { IBaseRepository } from './baseRepository.interface';

export interface IWorkflowRepository extends IBaseRepository<Workflow> {}
