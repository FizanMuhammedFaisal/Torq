import { logger } from '@/infrastructure/logger/logger';
import type { Interceptor } from '@connectrpc/connect';

/**
 * Interceptor to log RPC requests and responses
 */
export const loggingInterceptor: Interceptor = (next) => async (req) => {
	try {
		logger.info(`RPC Request: ${req.service.typeName}/${req.method.name}`);
		const res = await next(req);
		if (!res.stream) {
			logger.info(`RPC Response: ${req.service.typeName}/${req.method.name} - Success`);
		}
		return res;
	} catch (err) {
		logger.error(`RPC Error: ${req.service.typeName}/${req.method.name} - ${err}`);
		throw err;
	}
};
