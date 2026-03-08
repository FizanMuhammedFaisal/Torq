import { InfraError } from './infraError.abstract';
import { DOMAIN_ERROR_CODES } from '../../domain/errors/DOMAIN_ERROR_CODES';

export class DatabaseInternalError extends InfraError {
	constructor(message: string = 'Internal database error', isTransient: boolean = true) {
		super(DOMAIN_ERROR_CODES.DATABASE_ERROR, message, isTransient);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
