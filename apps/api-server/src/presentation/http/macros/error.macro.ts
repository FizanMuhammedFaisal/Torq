import { logger } from '@/infrastructure/logger/logger';
import { Elysia } from 'elysia';
import { injectable } from 'tsyringe';

@injectable()
export class ErrorMacro {
	plugin() {
		return new Elysia({ name: 'ErrorMacro' }).onError({ as: 'global' }, ({ code, error, set }) => {
			logger.info('--- ERROR MACRO CAUGHT ERROR ---');
			logger.info({ 'Code:': code });
			logger.info({ 'Error Type:': typeof error });
			logger.info({ 'Error Message:': error?.message });
			logger.info({ 'Has serialize:': typeof (error as any)?.serialize === 'function' });
			// Handle explicitly thrown DomainErrors (or objects acting like them)
			if (error && typeof (error as any).serialize === 'function') {
				const domainError = error as any;
				const errorCode = domainError.code as string;

				// Map domain specific error codes to HTTP status codes
				switch (errorCode) {
					case 'NOT_FOUND':
						set.status = 404;
						break;
					case 'CONFLICT':
						set.status = 409;
						break;
					case 'INVALID_SPEC':
					case 'SEMANTIC_VALIDATION_ERROR':
					case 'INVALID_VERSION':
						set.status = 400;
						break;
					default:
						set.status = 400;
				}

				const serialized = domainError.serialize();
				return {
					message: domainError.message,
					code: errorCode || 'DOMAIN_ERROR',
					issues: serialized?.[0]?.issues || serialized,
				};
			}

			// Handle Elysia built-in validation errors
			if (code === 'VALIDATION') {
				set.status = 400;
				return {
					message: 'Validation failed',
					code: 'VALIDATION_ERROR',
					issues: (error as any).all || error.message,
				};
			}

			if (code === 'NOT_FOUND') {
				set.status = 404;
				return {
					message: 'Route not found',
					code: 'NOT_FOUND',
				};
			}

			// Fallback for unexpected internal errors
			if (error instanceof Error) {
				logger.error({
					'Unhandled Error:': error.message,
					'Stack:': error.stack,
					'Constructor:': error.constructor?.name,
					RawObj: JSON.stringify(error, Object.getOwnPropertyNames(error)),
				});
			} else {
				logger.error({ 'Unhandled Non-Error:': error, Type: typeof error });
			}
			set.status = 500;
			return {
				message: 'Internal server error',
				code: 'INTERNAL_SERVER_ERROR',
			};
		});
	}
}
