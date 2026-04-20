import { injectable, inject } from 'tsyringe';
import type { ITriggerWorkflowRunUseCase } from '@/application/port/usecases/workflows/triggerWorkflowRun.interface';
import type {
	TriggerWorkflowRunInputDto,
	TriggerWorkflowRunOutputDto,
} from '@/application/dto/worflows/triggerWorkflowRun.dto';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowVersionRepository } from '@/application/port/repositories/workflowVersionRepository.interface';
import type { IWorkflowRunRepository } from '@/application/port/repositories/workflowRunRepository.interface';
import { DOMAIN_ERROR_CODES } from '@/domain/errors/DOMAIN_ERROR_CODES';
import { GeneralDomainError } from '@/domain/errors/generalDomainError';
import { WorkflowTriggerError } from '@/application/errors/workflowTriggerError';
import { AppError } from '@/application/errors/appError.abstract';
import { DomainError } from '@/domain/errors/domainError.abstract';
import { RunStatus, TriggerType } from '@/domain/entities/workflowRun';
import type { IOperatorService } from '@/application/port/services/operatorService.interface';
import { logger } from '@/infrastructure/logger/logger';

/**
 * Will be calling the operator system to execute this workflow
 */
@injectable()
export class TriggerWorkflowRunUseCase implements ITriggerWorkflowRunUseCase {
	constructor(
		@inject(TOKENS.WorkflowVersionRepository)
		private readonly workflowVersionRepository: IWorkflowVersionRepository,
		@inject(TOKENS.WorkflowRunRepository)
		private readonly workflowRunRepository: IWorkflowRunRepository,
		@inject(TOKENS.OperatorService)
		private readonly operatorService: IOperatorService,
	) {}

	async execute(data: TriggerWorkflowRunInputDto): Promise<TriggerWorkflowRunOutputDto> {
		const { workflowId, version, req } = data;

		const workflowVersion = version
			? await this.workflowVersionRepository.findByWorkflowIdAndVersion(workflowId, version)
			: await this.workflowVersionRepository.findLatestByWorkflowId(workflowId);

		if (!workflowVersion) {
			throw new GeneralDomainError(DOMAIN_ERROR_CODES.NOT_FOUND, 'Workflow version not found');
		}

		const run = await this.workflowRunRepository.create({
			workflowId,
			workflowVersionId: workflowVersion.id,
			identityId: req.id,
			status: RunStatus.PENDING,
			triggerType: TriggerType.MANUAL, // for now we only have manual
			triggeredBy: req.id,
		});

		try {
			await this.operatorService.triggerWorkflowRun({
				workflowRunId: run.id,
				workflowId,
				torqVersion: workflowVersion.torqVersion,
				versionId: workflowVersion.id,
				triggerType: TriggerType.MANUAL,
			});
		} catch (error) {
			logger.error({ 'Error triggering workflow run': error, runId: run.id });
			await this.workflowRunRepository.updateStatus(run.id, RunStatus.FAILED);

			if (error instanceof AppError || error instanceof DomainError) {
				throw error;
			}
			throw new WorkflowTriggerError();
		}

		return {
			runId: run.id,
			workflowId: run.workflowId,
			status: run.status,
		};
	}
}
