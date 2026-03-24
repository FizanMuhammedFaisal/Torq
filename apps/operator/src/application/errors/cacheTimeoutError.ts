import { AppError } from './appError.abstract';

export class CacheTimeoutError extends AppError {
	constructor(message: string = 'Cache operation timed out') {
		super('CACHE_TIMEOUT_ERROR', message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
