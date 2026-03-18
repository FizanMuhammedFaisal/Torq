import { z } from 'zod';
import type { AuthUser } from '@/presentation/http/macros/auth.macro';

export const RevealSecretSchema = z.object({
	workflowId: z.ulid('Invalid workflow ID format'),
	key: z.string().min(1, 'Secret key cannot be empty'),
});

export type RevealSecretInputDto = z.infer<typeof RevealSecretSchema> & { req: AuthUser };

export interface RevealSecretOutputDto {
	key: string;
	value: string;
}
