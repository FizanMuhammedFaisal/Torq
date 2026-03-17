import { DomainError } from './domainError.abstract';
import { DOMAIN_ERROR_CODES } from './DOMAIN_ERROR_CODES';

export class ConflictError extends DomainError {
	constructor(message: string) {
		super(DOMAIN_ERROR_CODES.DATABASE_ERROR, message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
