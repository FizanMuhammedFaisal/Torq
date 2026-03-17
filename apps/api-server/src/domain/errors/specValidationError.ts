import { DomainError } from './domainError.abstract';
import { DOMAIN_ERROR_CODES } from './DOMAIN_ERROR_CODES';

export class SpecValidationError extends DomainError {
	constructor(message: string) {
		super(DOMAIN_ERROR_CODES.INVALID_SPEC, message);
	}
	serialize(): { message: string; field?: string }[] {
		return [{ message: this.message, field: this.code }];
	}
}
