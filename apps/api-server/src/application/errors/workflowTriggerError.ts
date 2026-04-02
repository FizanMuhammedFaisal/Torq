import { AppError } from './appError.abstract';
import { DOMAIN_ERROR_CODES } from '@/domain/errors/DOMAIN_ERROR_CODES';

export class WorkflowTriggerError extends AppError {
	constructor(message = 'Could not trigger workflow try again later') {
		super(DOMAIN_ERROR_CODES.RETRYABLE_TRIGGER_ERROR, message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
