import z from 'zod';

export const CreateWorkflowSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	workflowJson: z.string(),
	secrets: z
		.array(
			z.object({
				key: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
});

export type CreateWorkflowInputDto = z.infer<typeof CreateWorkflowSchema>;

export type CreateWorkflowOutputDto = {
	id: string;
	name: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
};
