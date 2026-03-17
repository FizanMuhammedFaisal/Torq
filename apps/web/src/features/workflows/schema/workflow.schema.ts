import { z } from 'zod';

export const secretSchema = z.object({
	key: z.string().min(1, 'Secret key cannot be empty'),
	value: z.string().min(1, 'Secret value cannot be empty'),
});

export const createWorkflowSchema = z.object({
	name: z.string().min(1, 'Workflow name is required'),
	description: z.string().optional(),
	secrets: z.array(secretSchema).optional(),
});

export type CreateWorkflowFormValues = z.infer<typeof createWorkflowSchema>;
