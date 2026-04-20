import { DomainError } from './domainError.abstract';
import type { DomainErrorCodes } from './DOMAIN_ERROR_CODES';

export class GeneralDomainError extends DomainError {
	constructor(code: DomainErrorCodes, message: string) {
		super(code, message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
