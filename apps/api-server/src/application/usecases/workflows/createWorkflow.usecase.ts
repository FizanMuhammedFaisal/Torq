import type {
	CreateWorkflowInputDto,
	CreateWorkflowOutputDto,
} from '@/application/dto/worflows/createWorkflow.dto';
import type { IWorkflowRepository } from '@/application/port/repositories/workflowRepository.interface';
import type { IWorkflowVersionRepository } from '@/application/port/repositories/workflowVersionRepository.interface';
import type { ICreateWorkflowUseCase } from '@/application/port/usecases/workflows/createWorkflow.interface';
import type { IUnitOfWork } from '@/application/port/repositories/unitOfWork.interface';
import { TOKENS } from '@/config/di/tokens';
import { inject, injectable } from 'tsyringe';
import { DSLPipeline } from '@/domain/dsl/pipeline';
import { Workflow } from '@/domain/entities/workflow';
import { ulid } from 'ulid';
import { WorkflowVersion } from '@/domain/entities/workflowVersions';
import type { UpsertSecretsUseCase } from './upsertSecrets.usecase';
import type { ISpecParser } from '@/domain/dsl/types';

@injectable()
export class CreateWorkflowUseCase implements ICreateWorkflowUseCase {
	constructor(
		@inject(TOKENS.WorkflowRepository) private workflowRepository: IWorkflowRepository,
		@inject(TOKENS.WorkflowVersionRepository)
		private workflowVersionRepository: IWorkflowVersionRepository,
		@inject(TOKENS.SpecValidationService) private specValidationService: ISpecParser,
		@inject(TOKENS.UnitOfWork) private unitOfWork: IUnitOfWork,
		@inject(TOKENS.UpsertSecretsUseCase) private upsertSecretsUseCase: UpsertSecretsUseCase,
	) {}
	// validate json--> validate torq schema as version--> validate semantics per version (DAG)
	// create the version artifact
	// create the workflow itself
	// save encrypted secrects
	async execute(data: CreateWorkflowInputDto): Promise<CreateWorkflowOutputDto> {
		const dslPipeline = new DSLPipeline(this.specValidationService);
		const [spec, torqVersion] = await dslPipeline.process(data.workflowSpec, data.specFormat);
		console.log(spec, torqVersion);
		const workflow = Workflow.create({
			id: ulid(),
			name: data.name,
			description: data.description,
			createdAt: new Date(),
			identityId: data.req.id,
		});

		const workflowVersion = WorkflowVersion.create({
			id: ulid(),
			spec: spec,
			raw: data.workflowSpec,
			workflowId: workflow.id,
			version: 1,
			torqVersion: torqVersion,
			createdAt: new Date(),
		});

		const savedWorkflow = await this.unitOfWork.execute(async () => {
			const saved = await this.workflowRepository.save(workflow);
			await this.workflowVersionRepository.save(workflowVersion);
			return saved;
		});

		if (data.secrets) {
			try {
				await this.upsertSecretsUseCase.execute({
					id: workflow.id,
					secrets: data.secrets,
					req: data.req,
				});
			} catch (error) {
				throw new Error('Workflow created but failed to save secrets. Please try again.');
			}
		}
		return {
			id: savedWorkflow.id,
			name: savedWorkflow.name,
			description: savedWorkflow.description,
			createdAt: savedWorkflow.createdAt,
			updatedAt: savedWorkflow.createdAt,
		};
	}
}
