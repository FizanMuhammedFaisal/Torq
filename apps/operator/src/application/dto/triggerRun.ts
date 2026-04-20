import { Registry } from '@/domain/registry';
import { z } from 'zod';


const triggerType = z.enum(['MANUAL', 'WEBHOOK', 'SCHEDULE']);
export const triggerRunSchema = z.object({
	workflowId: z.string(),
	versionId: z.string(),
	torqVersion: z.enum(Array.from(Object.values(Registry))),
	triggerType: triggerType,
	createdAt: z.date(),
});

export type TriggerType = z.infer<typeof triggerType>;

export type TriggerRunInput = z.infer<typeof triggerRunSchema>;

export type TriggerRunOutput = {
	success: boolean;
};
