import z from 'zod';

export const GetWorkflowSpecInputDto = z.object({
	workflowId: z.string(),
	versionId: z.string().optional(),
	secrets: z.boolean().optional().default(false),
});

export type GetWorkflowSpecInput = z.infer<typeof GetWorkflowSpecInputDto>;
export type GetWorkflowSpecOutput = {
	workflowId: string;
	versionId: string;
	spec: Record<string, unknown>;
	secrets?: { name: string; value: string }[];
	createdAt: Date;
};
