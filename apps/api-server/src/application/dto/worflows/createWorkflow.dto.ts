import type { AuthUser } from '@/presentation/macros/auth.macro';
import z from 'zod';

export const CreateWorkflowSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	workflowSpec: z.string(),
	specFormat: z.enum(['yaml', 'json']),
	secrets: z
		.array(
			z.object({
				key: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
});

export type CreateWorkflowInputDto = z.infer<typeof CreateWorkflowSchema> & { req: AuthUser };

export type CreateWorkflowOutputDto = {
	id: string;
	name: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
};
