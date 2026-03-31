import type { ICleanUpService } from '@/application/port/services/cleanUp.inerface';
import type { WorkflowRun } from '@/domain/entities/workflowRun';

export class CleanUpService implements ICleanUpService {
    handle(run: WorkflowRun): Promise<void> {
        // check if jobs are done
        // check if hte sidecards have exited sucessfully
        // 
        // update to db
        //update to message queue

    }
}
