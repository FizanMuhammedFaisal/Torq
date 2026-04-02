import { InvalidRequestError } from '@/application/errors/invalidRequestError';
import type { z } from 'zod';

/**
 * use zod safeparse and throws 
 */
export function validate<T extends z.ZodSchema>(schema: T, data: z.input<T>): z.output<T> {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errorMessage = result.error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', ');
        throw new InvalidRequestError(`Validation failed: ${errorMessage}`);
    }
    return result.data;
}
