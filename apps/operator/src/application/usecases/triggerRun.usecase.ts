import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowRunDispatcherService } from '../port/services/workflowRunDispatcher.interface';
import type { TriggerRunInput, TriggerRunOutput } from '../dto/triggerRun';
import type { ITriggerRunUseCase } from '../port/usecases/triggerRun.interface';
import { logger } from '@/infrastructure/logger/logger';
/**
 * Would call the workflowDispatcher to trigger the run
 */
@injectable()
export class TriggerRunUseCase implements ITriggerRunUseCase {
	constructor(
		@inject(TOKENS.WorkflowRunDispatcherService)
		private workflowRunDispatcherService: IWorkflowRunDispatcherService,
	) { }
	async execute(data: TriggerRunInput): Promise<TriggerRunOutput> {
		await this.workflowRunDispatcherService.create(data);
		logger.info(`Workflow run triggered for workflowId: ${data.workflowId}, versionId: ${data.versionId}`);
		return { success: true };
	}
}
