import { GetWorkflowSpecOutput } from "@/application/dto/worflows/getWorkflowSpec.dto";
import { inject } from "tsyringe";
import { type IWorkflowVersionRepository } from "@/application/port/repositories/workflowVersionRepository.interface";

import { IGetWorkflowSpecUseCase } from "@/application/port/usecases/workflows/getWorkflowSpec.interface";
import { NotFoundError } from "@/domain/errors/notFoundError";
import { TOKENS } from "@/config/di/tokens";
import { type ISecretManagementService } from "@/application/port/services/secretManagementService.interface";
import { type ISecrectRepository } from "@/application/port/repositories/secrectRepository.interface";

export class GetWorkflowSpecUseCase implements IGetWorkflowSpecUseCase {
    constructor(
        @inject(TOKENS.WorkflowVersionRepository) private workflowVersionRepository: IWorkflowVersionRepository,
        @inject(TOKENS.SecretRepository) private secretRepository: ISecrectRepository,
        @inject(TOKENS.SecretManagementService) private secretService: ISecretManagementService
    ) {

    }
    async execute(data: { workflowId: string; versionId: string; }): Promise<GetWorkflowSpecOutput> {
        const workflow = await this.workflowVersionRepository.findByWorkflowIdAndVersion(data.workflowId, Number(data.versionId))
        if (!workflow) {
            throw new NotFoundError("Workflow version");
        }
        const secretsFromDB = await this.secretRepository.findByWorkflowId(workflow.workflowId);


        const secrets = await Promise.all(secretsFromDB.map(async (curr) => {
            const val = await this.secretService.decryptSecret({
                ciphertext: curr.ciphertext,
                iv: curr.iv,
                tag: curr.tag
            })
            return {
                name: curr.key,
                value: val
            }
        }))

        return {
            workflowId: workflow.workflowId,
            secrets: secrets,
            createdAt: workflow.createdAt,
            versionId: String(workflow.version),
            spec: workflow.spec

        }
    }

}