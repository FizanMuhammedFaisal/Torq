import { z } from 'zod';

export const GetCategoriesRpcSchema = z.object({
	page: z.number().int().positive().optional().default(1),
	limit: z.number().int().positive().max(100).optional().default(20),
	search: z.string().max(100).optional(),
	name: z.string().max(100).optional(),
	includeDeleted: z.boolean().optional().default(false),
	sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('createdAt'),
	sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type GetCategoriesRpcDto = z.infer<typeof GetCategoriesRpcSchema>;
