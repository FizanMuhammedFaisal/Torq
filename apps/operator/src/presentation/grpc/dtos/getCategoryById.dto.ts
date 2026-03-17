import { z } from 'zod';

export const GetCategoryByIdRpcSchema = z.object({
	id: z.string().min(24).max(24),
});

export type GetCategoryByIdRpcDto = z.infer<typeof GetCategoryByIdRpcSchema>;
