import { DomainError } from './domainError.abstract';
import { DOMAIN_ERROR_CODES } from './DOMAIN_ERROR_CODES';

export class DSLVersionError extends DomainError {
	constructor(message: string) {
		super(DOMAIN_ERROR_CODES.INVALID_VERSION, message);
	}

	serialize() {
		return [{ message: this.message, field: this.code }];
	}
}
