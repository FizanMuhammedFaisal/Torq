import type { ICleanUpService } from '@/application/port/services/cleanUp.inerface';
import { WorkflowRun } from '@/domain/entities/workflowRun';
import { logger } from '../logger/logger';
import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';

export class CleanUpService implements ICleanUpService {
    constructor() { }
    handle(run: WorkflowRunSnapshot): Promise<void> {
        logger.trace({ WorkflowRun });
        // check if jobs are done

        // check if hte sidecards have exited sucessfully
        //
        // update to db
        //update to message queue
    }
}
