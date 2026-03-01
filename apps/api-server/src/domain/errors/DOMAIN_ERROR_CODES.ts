export const DOMAIN_ERROR_CODES = {
	ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
} as const;

export type DomainErrorCodes = (typeof DOMAIN_ERROR_CODES)[keyof typeof DOMAIN_ERROR_CODES];
