import { inject } from 'tsyringe';
import type { ITriggerRun } from '../port/usecases/triggerRun.interface';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowRunDispatcherService } from '../port/services/workflowRunDispatcher.interface';
import type { TriggerRunInput, TriggerRunOutput } from '../dto/triggerRun';
/**
 * Would call the workflowDispatcher to trigger the run
 */
export class TriggerRun implements ITriggerRun {
	constructor(
		@inject(TOKENS.IWorkflowRunDispatcherService)
		private workflowRunDispatcherService: IWorkflowRunDispatcherService,
	) {}
	execute(data: TriggerRunInput): Promise<TriggerRunOutput> {
		this.workflowRunDispatcherService.create(data);
	}
}
