import { UpdateWorkflowInputDto, UpdateWorkflowOutputDto } from "@/application/dto/worflows/updateWorkflow.dto";

export interface IUpdateWorkflowUseCase {
    execute(data: UpdateWorkflowInputDto): Promise<UpdateWorkflowOutputDto>;
}
