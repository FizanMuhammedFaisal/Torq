import type { ICleanUpService } from '@/application/port/services/cleanUp.inerface';

import { logger } from '../logger/logger';
import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';

export class CleanUpService implements ICleanUpService {
	constructor() {}
	handle(run: WorkflowRunSnapshot): Promise<void> {
		logger.trace({ run });
		// check if jobs are done

		// check if hte sidecards have exited sucessfully
		//
		// update to db
		//update to message queue
	}
}
