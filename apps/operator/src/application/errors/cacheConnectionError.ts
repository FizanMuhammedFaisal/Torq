import { AppError } from './appError.abstract';

export class CacheConnectionError extends AppError {
	constructor(message: string = 'Failed to connect to the cache service') {
		super('CACHE_CONNECTION_ERROR', message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
