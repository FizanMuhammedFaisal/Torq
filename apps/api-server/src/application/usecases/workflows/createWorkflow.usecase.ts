import type {
	CreateWorkflowInputDto,
	CreateWorkflowOutputDto,
} from '@/application/dto/worflows/createWorkflow.dto';
import { SpecValidationError } from '@/domain/errors/specValidation.error';
import type { ISecrectRepository } from '@/application/port/repositories/secrectRepository.interface';
import type { IWorkflowRepository } from '@/application/port/repositories/workflowRepository.interface';
import type { IWorkflowVersionRepository } from '@/application/port/repositories/workflowVersionRepository.interface';
import type { ISecretManagementService } from '@/application/port/services/secretManagementService.interface';
import type { ICreateWorkflowUseCase } from '@/application/port/usecases/workflows/createWorkflow.interface';
import { TOKENS } from '@/config/di/tokens';
import type { SpecValidationService } from '@/infrastructure/services/specValidationService';
import { inject } from 'tsyringe';
import { DSLPipeline } from '@/domain/dsl/pipeline';

export class CreateWorkflowUseCase implements ICreateWorkflowUseCase {
	constructor(
		@inject(TOKENS.SecretManagementService)
		private secretManagementService: ISecretManagementService,
		@inject(TOKENS.WorkflowRepository) private workflowRepository: IWorkflowRepository,
		@inject(TOKENS.SecretRepository) private secretRepository: ISecrectRepository,
		@inject(TOKENS.WorkflowVersionRepository)
		private workflowVersionRepository: IWorkflowVersionRepository,
		@inject(TOKENS.SpecValidationService) private specValidationService: SpecValidationService,
	) { }

	// validate json--> validate torq schema as version--> validate semantics per version (DAG)
	// create the version artifact
	// create the workflow itself
	// save encrypted secrects
	async execute(data: CreateWorkflowInputDto): Promise<CreateWorkflowOutputDto> {

		const dslPipeline = new DSLPipeline(this.specValidationService)
		await dslPipeline.process(data.specFormat, data.specFormat)

	}
}
