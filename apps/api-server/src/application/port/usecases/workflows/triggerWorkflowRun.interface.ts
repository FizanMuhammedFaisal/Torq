import type {
	TriggerWorkflowRunInputDto,
	TriggerWorkflowRunOutputDto,
} from '@/application/dto/worflows/triggerWorkflowRun.dto';

export interface ITriggerWorkflowRunUseCase {
	execute(data: TriggerWorkflowRunInputDto): Promise<TriggerWorkflowRunOutputDto>;
}
