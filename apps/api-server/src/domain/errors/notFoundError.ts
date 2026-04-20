import { DomainError } from './domainError.abstract';
import { DOMAIN_ERROR_CODES } from './DOMAIN_ERROR_CODES';

export class NotFoundError extends DomainError {
	constructor(entity: string) {
		super(DOMAIN_ERROR_CODES.NOT_FOUND, `${entity} not found`);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
