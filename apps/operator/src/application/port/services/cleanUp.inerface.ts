import type { WorkflowRunSnapshot } from '@/domain/entities/workflowRunSnapshot';

export type ICleanUpService = {
	handle(run: WorkflowRunSnapshot): Promise<void>;
};

//clean external things
//remove finilizers
