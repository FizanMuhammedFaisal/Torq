import { z } from 'zod';

export const GetTagByIdRpcSchema = z.object({
	id: z.string().min(1, 'Tag ID is required'),
});

export type GetTagByIdRpcDto = z.infer<typeof GetTagByIdRpcSchema>;
