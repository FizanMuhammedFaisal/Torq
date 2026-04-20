import { UpdateWorkflowInputDto, UpdateWorkflowOutputDto } from "@/application/dto/worflows/updateWorkflow.dto";
import { type IUnitOfWork } from "@/application/port/repositories/unitOfWork.interface";
import { type IWorkflowRepository } from "@/application/port/repositories/workflowRepository.interface";
import { type IWorkflowVersionRepository } from "@/application/port/repositories/workflowVersionRepository.interface";
import { IUpdateWorkflowUseCase } from "@/application/port/usecases/workflows/updateWorkflow.interface";
import { TOKENS } from "@/config/di/tokens";
import { DSLPipeline } from "@/domain/dsl/pipeline";
import { type ISpecParser } from "@/domain/dsl/types";
import { Workflow } from "@/domain/entities/workflow";
import { WorkflowVersion } from "@/domain/entities/workflowVersions";
import { NotFoundError } from "@/domain/errors/notFoundError";
import { inject, injectable } from "tsyringe";
import { ulid } from "ulid";

@injectable()
export class UpdateWorkflowUseCase implements IUpdateWorkflowUseCase {
    constructor(
        @inject(TOKENS.WorkflowVersionRepository) private workflowVersionRepository: IWorkflowVersionRepository,
        @inject(TOKENS.WorkflowRepository) private workflowRepository: IWorkflowRepository,
        @inject(TOKENS.SpecValidationService) private specValidationService: ISpecParser,
        @inject(TOKENS.UnitOfWork) private unitOfWork: IUnitOfWork,
    ) {
    }
    async execute(data: UpdateWorkflowInputDto): Promise<UpdateWorkflowOutputDto> {
        // if this is spec update update hte workflowversion
        console.log(data)
        if (data.raw) {
            // fetch teh latest
            const workflowlatest = await this.workflowVersionRepository.findLatestByWorkflowId(data.id)
            const workflow = await this.workflowRepository.findById(data.id)
            console.log(workflowlatest, workflow)
            if (!workflowlatest || !workflow) {
                throw new NotFoundError("Worklfow Current Version not Found")
            }
            const dslPipeline = new DSLPipeline(this.specValidationService);
            const [spec, torqVersion] = await dslPipeline.process(data.raw, data.specFormat);

            const newWorkflow = Workflow.create(workflow)
            newWorkflow.update(data.name, data.description)
            const workflowVersion = WorkflowVersion.create({
                id: ulid(),
                spec: spec,
                raw: data.raw,
                workflowId: data.id,
                version: workflowlatest.version + 1, //updataing version 
                torqVersion: torqVersion,
                createdAt: new Date(),
            });
            console.log(data)
            console.log(workflowVersion)
            await this.unitOfWork.execute(async () => {
                const saved = await this.workflowRepository.save(newWorkflow);
                await this.workflowVersionRepository.save(workflowVersion);
                return saved;
            });

            return {
                id: newWorkflow.id,
                description: newWorkflow.description,
                name: newWorkflow.name,
                raw: workflowVersion.raw
            }
        } else {
            const workflow = await this.workflowRepository.findById(data.id)
            if (!workflow) {
                throw new NotFoundError("Worklfow Current Version not Found")
            }
            const newWorkflow = Workflow.create(workflow)
            newWorkflow.update(data.name, data.description)
            await this.workflowRepository.save(newWorkflow)
            return {
                id: workflow.id,
                description: workflow.description,
                name: workflow.name
            }
        }

    }
}