import { GetWorkflowRunInputDto, GetWorkflowRunOutputDto } from "@/application/dto/worflows/getWorkflowRun.dto";
import { IUseCase } from "../usecases.interface";

export interface IGetWorkflowRunsUseCase extends IUseCase<GetWorkflowRunInputDto, GetWorkflowRunOutputDto> { }
