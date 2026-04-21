import z from 'zod';

export const GetWorkflowSpecInputSchema = z.object({
	workflowId: z.string(),
	versionId: z.string().optional(),
	secrets: z.boolean().optional().default(false),
	raw: z.boolean().default(false),
});

export const GetWorkflowSpecInputSchemaQuery = z.object({
	versionId: z.string().optional(),
	secrets: z.boolean().optional().default(false),
	raw: z.boolean().default(false),
});
export const GetWorkflowSpecInputSchemaParams = z.object({
	id: z.string(),
});

export type GetWorkflowSpecInput = z.infer<typeof GetWorkflowSpecInputSchema>;
export type GetWorkflowSpecOutput = {
	workflowId: string;
	versionId: string;
	spec: Record<string, unknown> | string;
	secrets?: { name: string; value: string }[];
	createdAt: Date;
};
