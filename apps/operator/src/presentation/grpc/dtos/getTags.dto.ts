import { z } from 'zod';

export const GetTagsRpcSchema = z.object({
	page: z.number().int().positive().optional().default(1),
	limit: z.number().int().positive().max(100).optional().default(20),
	search: z.string().max(100).optional(),
	name: z.string().max(100).optional(),
	sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('createdAt'),
	sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetTagsRpcDto = z.infer<typeof GetTagsRpcSchema>;
