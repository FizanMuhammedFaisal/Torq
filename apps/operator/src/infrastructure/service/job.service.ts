import type { IJobService } from '@/application/port/services/jobService.interface';
import type { IJobRepository } from '@/application/port/repository/jobs.interface';
import type { IJobBuilderVersionRouter } from '../k8s/jobs/interface/jobRouter.inteface';
import type { TorqJob } from '@/domain/entities/job/job';
import { TOKENS } from '@/config/di/tokens';
import { inject, injectable } from 'tsyringe';
import { logger } from '../logger/logger';

@injectable()
export class JobService implements IJobService {
	constructor(
		@inject(TOKENS.JobBuilderVersionRouter) private jobBuilderRouter: IJobBuilderVersionRouter,
		@inject(TOKENS.JobRepository) private jobRepository: IJobRepository,
	) {}

	async createJob(job: TorqJob): Promise<{ created: boolean }> {
		const builder = this.jobBuilderRouter.resolve(job.torqVersion);
		if (!builder) {
			throw new Error(
				`No job builder for torqVersion "${job.torqVersion}". Supported: ${this.jobBuilderRouter.supported().join(', ')}`,
			);
		}
		const manifest = builder.buildJob(job);
		logger.debug({ jobName: manifest.metadata?.name, namespace: manifest.metadata?.namespace }, 'Submitting K8s Job');
		return this.jobRepository.create(manifest);
	}
}