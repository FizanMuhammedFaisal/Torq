import { inject } from 'tsyringe';
import type { ITriggerRun } from '../port/usecases/triggerRun.interface';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowRunDispatcherService } from '../port/services/workflowRunDispatcher.interface';
/**
 *  build the CRD object
 *  call K8s API to create it
 *  add a finalizer
 *  write RunCreated event to DB
 *  publish state to Message Stream
 */
export class TriggerRun implements ITriggerRun {
    constructor(
        @inject(TOKENS.IWorkflowRunDispatcherService)
        private workflowRunDispatcherService: IWorkflowRunDispatcherService,
    ) { }
    execute(data: any): Promise<void> {


        this.workflowRunDispatcherService.create(data)

    }
}
