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
	execute(data: CreateWorkflowInputDto): Promise<CreateWorkflowOutputDto> {
		// validate json--> a. v alidtion ssytme for each interaoitn of the torq syntax an if not valid throw error for the editor to se
		// make sure the dag is correct
		// create the version
		// create the workflow itself
		// add secrect that are given

		
	}
}
