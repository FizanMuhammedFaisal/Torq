import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';

export type ICleanUpService = {
	handle(run: WorkflowRunSnapshot): Promise<void>;
};

//clean external things
//remove finilizers
