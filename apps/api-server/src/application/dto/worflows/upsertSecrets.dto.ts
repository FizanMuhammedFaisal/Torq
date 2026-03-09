import { z } from 'zod';
import type { AuthUser } from '@/presentation/macros/auth.macro';

export const SecretInputSchema = z.object({
	key: z.string().min(1, 'Secret key cannot be empty'),
	value: z.string().min(1, 'Secret value cannot be empty'),
});

export const UpsertSecretsSchema = z.object({
	workflowId: z.ulid('Invalid workflow ID format'),
	// Accept either a single secret or an array of secrets
	secrets: z.union([SecretInputSchema, z.array(SecretInputSchema)]),
});

export type UpsertSecretsInputDto = z.infer<typeof UpsertSecretsSchema> & { req: AuthUser };

export type UpsertSecretsOutputDto = {
	count: number;
};
