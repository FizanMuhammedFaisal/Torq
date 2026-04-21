import { logger } from '@/infrastructure/logger/logger';
import { Elysia } from 'elysia';
import { injectable } from 'tsyringe';

@injectable()
export class ErrorMacro {
	plugin() {
		return new Elysia({ name: 'ErrorMacro' }).onError({ as: 'global' }, ({ code, error, set }) => {
			logger.error({ err: error, code }, 'API Request Failed');

			// Elysia built-in validation
			if (code === 'VALIDATION') {
				set.status = 400;
				return { message: 'Validation failed', code: 'VALIDATION_ERROR' };
			}

			// Any error with a status property
			if ('status' in error && typeof error.status === 'number') {
				set.status = error.status;
				return {
					message: error.message,
					code: (error as any).code ?? 'DOMAIN_ERROR',
				};
			}

			logger.error({ stack: error }, 'Unhandled error');
			set.status = 500;
			return { message: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' };
		});
	}
}



