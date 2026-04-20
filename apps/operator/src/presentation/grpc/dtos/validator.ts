import { ConnectError, Code } from '@connectrpc/connect';
import type { z } from 'zod';

/**
 * Validates data against a Zod schema.
 * Throws ConnectError with InvalidArgument code if validation fails.
 */
export function validate<T extends z.ZodSchema>(schema: T, data: z.input<T>): z.output<T> {
	const result = schema.safeParse(data);
	if (!result.success) {
		const errorMessage = result.error.issues
			.map((e) => `${e.path.join('.')}: ${e.message}`)
			.join(', ');
		throw new ConnectError(`Validation failed: ${errorMessage}`, Code.InvalidArgument);
	}
	return result.data;
}
