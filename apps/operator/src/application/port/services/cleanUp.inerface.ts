import type { WorkflowRun } from '@/domain/entities/workflowRun';

export type ICleanUpService = {
    handle(run: WorkflowRun): Promise<void>;
};

//clean external things
//remove finilizers
