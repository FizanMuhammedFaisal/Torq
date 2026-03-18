import { ConnectError, Code, type Interceptor } from '@connectrpc/connect';
import { ConnectCodeForAppErrorCode } from '../constants/ConnectCodeForAppErrorCode';
import { ErrorResponseSchema } from '@torq-system/grpc';
import { logger } from '@/infrastructure/logger/logger';
import { DomainError } from '@/domain/errors/domainError.abstract';
import { AppError } from '@/application/errors/appError.abstract';
// Learn about interceptors here: https://connectrpc.com/docs/node/interceptors/#context-values
// error code : https://connectrpc.com/docs/protocol/#error-codes
// https://connectrpc.com/docs/web/errors

/**
 * Global Error Interceptor
 * Catches all errors thrown by RPC methods.
 * If the error is not a ConnectError, it logs it and wraps it in a ConnectError with Code.Internal.
 */
export const errorInterceptor: Interceptor = (next) => async (req) => {
	try {
		return await next(req);
	} catch (err) {
		// If it's already a ConnectError, rethrow it
		if (err instanceof ConnectError) {
			throw err;
		}

		if (err instanceof DomainError || err instanceof AppError) {
			logger.error({ error: err }, 'RPC: Domain/Application error occurred');
			throw new ConnectError(
				err.message,
				ConnectCodeForAppErrorCode[err.code],
				{
					error_code: err.code,
				},
				err.serialize().map((err) => ({ desc: ErrorResponseSchema, value: err })),
			);
		}

		// Wrap unexpected errors in a generic Internal Server Error
		logger.error({ error: err }, 'RPC: Unexpected error occurred');
		throw new ConnectError('Internal server error', Code.Internal);
	}
};	
