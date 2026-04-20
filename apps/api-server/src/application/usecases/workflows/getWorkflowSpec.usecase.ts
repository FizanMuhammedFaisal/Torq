import type {
	GetWorkflowSpecInput,
	GetWorkflowSpecOutput,
} from '@/application/dto/worflows/getWorkflowSpec.dto';
import { inject, injectable } from 'tsyringe';
import type { IWorkflowVersionRepository } from '@/application/port/repositories/workflowVersionRepository.interface';

import type { IGetWorkflowSpecUseCase } from '@/application/port/usecases/workflows/getWorkflowSpec.interface';
import { NotFoundError } from '@/domain/errors/notFoundError';
import { TOKENS } from '@/config/di/tokens';
import type { ISecretManagementService } from '@/application/port/services/secretManagementService.interface';
import type { ISecrectRepository } from '@/application/port/repositories/secrectRepository.interface';
import type { WorkflowVersion } from '@/domain/entities/workflowVersions';

// called by operator
@injectable()
export class GetWorkflowSpecUseCase implements IGetWorkflowSpecUseCase {
	constructor(
		@inject(TOKENS.WorkflowVersionRepository)
		private workflowVersionRepository: IWorkflowVersionRepository,
		@inject(TOKENS.SecretRepository) private secretRepository: ISecrectRepository,
		@inject(TOKENS.SecretManagementService) private secretService: ISecretManagementService,
	) { }
	async execute(data: GetWorkflowSpecInput): Promise<GetWorkflowSpecOutput> {
		console.log(data)
		let workflow: WorkflowVersion | null = null;
		if (!data.versionId) {
			workflow = await this.workflowVersionRepository.findLatestByWorkflowId(data.workflowId);
		} else {
			workflow = await this.workflowVersionRepository.findById(data.versionId);
		}
		if (!workflow) {
			throw new NotFoundError('Workflow version');
		}
		let secrets:
			| undefined
			| {
				name: string;
				value: string;
			}[];
		if (data.secrets) {
			const secretsFromDB = await this.secretRepository.findByWorkflowId(workflow.workflowId);

			secrets = await Promise.all(
				secretsFromDB.map(async (curr) => {
					const val = await this.secretService.decryptSecret({
						ciphertext: curr.ciphertext,
						iv: curr.iv,
						tag: curr.tag,
					});
					return {
						name: curr.key,
						value: val,
					};
				}),
			);
		}

		return {
			workflowId: workflow.workflowId,
			secrets: secrets,
			createdAt: workflow.createdAt,
			versionId: workflow.id,
			spec: data.raw ? workflow.raw : workflow.spec,
		};
	}
}
