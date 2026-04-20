import { AppError } from './appError.abstract';

export class InvalidRequestError extends AppError {
	constructor(message = 'Invalid request', code = 'INVALID_REQUEST') {
		super(code, message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
