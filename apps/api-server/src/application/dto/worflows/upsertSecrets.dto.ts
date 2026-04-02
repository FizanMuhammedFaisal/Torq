import { z } from 'zod';
import type { AuthUser } from '@/presentation/http/macros/auth.macro';

export const SecretInputSchema = z.object({
	key: z.string().min(1, 'Secret key cannot be empty'),
	value: z.string().min(1, 'Secret value cannot be empty'),
});

export const UpsertSecretsQuerySchema = z.object({
	id: z.ulid('Invalid workflow ID format'),
});
export const UpsertSecretsSchema = z.object({
	// Accept either a single secret or an array of secrets
	secrets: z.union([SecretInputSchema, z.array(SecretInputSchema)]),
});

export type UpsertSecretsInputDto = {
	id: z.infer<typeof UpsertSecretsQuerySchema>['id']
	secrets: z.infer<typeof UpsertSecretsSchema>['secrets']
} & {
	req: AuthUser
};

export type UpsertSecretsOutputDto = {
	count: number;
};
