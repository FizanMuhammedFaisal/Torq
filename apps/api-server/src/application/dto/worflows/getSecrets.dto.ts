import { z } from 'zod';
import type { AuthUser } from '@/presentation/http/macros/auth.macro';

export const GetSecretsSchema = z.object({
	workflowId: z.ulid('Invalid workflow ID format'),
});

export type GetSecretsInputDto = z.infer<typeof GetSecretsSchema> & { req: AuthUser };

export type GetSecretsOutputDto = {
	id: string;
	key: string;
	createdAt: Date;
	updatedAt: Date;
}[];
