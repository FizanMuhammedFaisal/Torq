import { z } from 'zod';

const triggerType = z.enum(['MANUAL', 'WEBHOOK', 'SCHEDULE']);
export const triggerRunSchema = z.object({
	workflowId: z.string(),
	versionId: z.string(),
	torqVersion: z.string(),
	triggerType: triggerType,
});

export type TriggerType = z.infer<typeof triggerType>;

export type TriggerRunInput = z.infer<typeof triggerRunSchema>;

export type TriggerRunOutput = {
	runId: string;
};
