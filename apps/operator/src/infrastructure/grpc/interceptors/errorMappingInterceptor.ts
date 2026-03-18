import { ConnectError, type Interceptor } from '@connectrpc/connect';
import { GeneralDomainError } from '@/domain/errors/generalDomainError';
import { GeneralAppError } from '@/application/errors/generalAppError';
import { DOMAIN_ERROR_CODES, type DomainErrorCodes } from '@/domain/errors/DOMAIN_ERROR_CODES';
import { logger } from '@/infrastructure/logger/logger';
import { AppErrorCodeForConnectCode } from '../constants/AppErrorCodeForConnectCode';

const DOMAIN_CODES = new Set<string>(Object.values(DOMAIN_ERROR_CODES));

export const clientErrorMappingInterceptor: Interceptor = (next) => async (req) => {
	try {
		return await next(req);
	} catch (err) {
		// not a ConnectError — unexpected infra failure,
		if (!(err instanceof ConnectError)) {
			logger.error({ error: err }, 'gRPC client: unexpected non-Connect error');
			throw err;
		}
		// try to get the structured error_code the server packed in the metadata
		const errorCode = err.metadata.get('error_code')?.[0];

		const mappedCode =
			errorCode ?? // server sent a structured code
			AppErrorCodeForConnectCode[err.code] ?? // fallback: map gRPC code
			DOMAIN_ERROR_CODES.INTERNAL_SERVER_ERROR;

		logger.error(
			{ grpcCode: err.code, errorCode: mappedCode, message: err.message },
			'gRPC client: mapped ConnectError',
		);

		if (errorCode && DOMAIN_CODES.has(errorCode)) {
			throw new GeneralDomainError(errorCode as DomainErrorCodes, err.message);
		}

		throw new GeneralAppError(mappedCode, err.message);
	}
};
