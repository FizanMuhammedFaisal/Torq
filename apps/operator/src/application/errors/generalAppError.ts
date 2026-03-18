import { AppError } from './appError.abstract';

export class GeneralAppError extends AppError {
	constructor(code: string, message: string) {
		super(code, message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
