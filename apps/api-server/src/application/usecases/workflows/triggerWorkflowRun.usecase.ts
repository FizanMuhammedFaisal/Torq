import { injectable, inject } from 'tsyringe';
import type { ITriggerWorkflowRunUseCase } from '@/application/port/usecases/workflows/triggerWorkflowRun.interface';
import type {
	TriggerWorkflowRunInputDto,
	TriggerWorkflowRunOutputDto,
} from '@/application/dto/worflows/triggerWorkflowRun.dto';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowVersionRepository } from '@/application/port/repositories/workflowVersionRepository.interface';
import type { IWorkflowRunRepository } from '@/application/port/repositories/workflowRunRepository.interface';
import { RUN_STATUS, TRIGGER_TYPE } from '@/application/port/repositories/workflowRunRepository.interface';
import type { IOperatorService } from '@/application/port/services/operatorService.interface';
import { DOMAIN_ERROR_CODES } from '@/domain/errors/DOMAIN_ERROR_CODES';
import { GeneralDomainError } from '@/domain/errors/generalDomainError';
import { WorkflowTriggerError } from '@/application/errors/workflowTriggerError';
import { AppError } from '@/application/errors/appError.abstract';
import { DomainError } from '@/domain/errors/domainError.abstract';

@injectable()
export class TriggerWorkflowRunUseCase implements ITriggerWorkflowRunUseCase {
	constructor(
		@inject(TOKENS.WorkflowVersionRepository)
		private readonly workflowVersionRepository: IWorkflowVersionRepository,
		@inject(TOKENS.WorkflowRunRepository)
		private readonly workflowRunRepository: IWorkflowRunRepository,
		@inject(TOKENS.OperatorService)
		private readonly operatorService: IOperatorService,
	) { }

	async execute(data: TriggerWorkflowRunInputDto): Promise<TriggerWorkflowRunOutputDto> {
		const { workflowId, version, req } = data;

		// Fetch the version
		const workflowVersion = version
			? await this.workflowVersionRepository.findByWorkflowIdAndVersion(workflowId, version)
			: await this.workflowVersionRepository.findLatestByWorkflowId(workflowId);

		if (!workflowVersion) {
			throw new GeneralDomainError(DOMAIN_ERROR_CODES.NOT_FOUND, 'Workflow version not found');
		}

		// Create the run record in state 'idle' or 'running'
		const run = await this.workflowRunRepository.createRun({
			workflowId,
			workflowVersionId: workflowVersion.id,
			identityId: req.id,
			status: RUN_STATUS.RUNNING,
			triggerType: TRIGGER_TYPE.MANUAL, // hardcoded for now as per web trigger context
			triggeredBy: req.id,
			steps: 0,
		});
		try {
			await this.operatorService.triggerWorkflowRun({
				workflowId,
				spec: JSON.stringify(workflowVersion.spec),
			});
		} catch (error) {
			await this.workflowRunRepository.updateRunStatus(run.id, RUN_STATUS.FAILED);

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
