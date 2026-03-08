import type { IBaseRepository } from './baseRepository.interface';
import type { Secret } from '@/domain/entities/secrets';

export interface ISecrectRepository extends IBaseRepository<Secret> {}
