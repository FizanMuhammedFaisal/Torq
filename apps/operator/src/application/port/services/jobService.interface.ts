import type { TorqJob } from '@/domain/entities/job/job';

export interface IJobService {
	// Idempotently submits a K8s Job, Returns true when created if false when already existed (409)
	createJob(job: TorqJob): Promise<{ created: boolean }>;
}