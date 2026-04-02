import { GetWorkflowRunInputDto, GetWorkflowRunOutputDto } from "@/application/dto/worflows/getWorkflowRun.dto";
import { IGetWorkflowRunsUseCase } from "@/application/port/usecases/workflows/getWorkflowRuns.interface";

export class GetWorkflowRunsUseCase implements IGetWorkflowRunsUseCase {
    execute(data: GetWorkflowRunInputDto): Promise<GetWorkflowRunOutputDto> {
        throw new Error("Method not implemented.");
    }
}