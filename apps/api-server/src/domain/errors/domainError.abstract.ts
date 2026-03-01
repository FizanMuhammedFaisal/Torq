import type { DomainErrorCodes } from './DOMAIN_ERROR_CODES';

export abstract class DomainError extends Error {
	public readonly isTransient: boolean = false;
	constructor(
		public readonly code: DomainErrorCodes,
		message: string,
	) {
		// domian errors are always transient
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		Error.captureStackTrace(this, this.constructor);
		Object.setPrototypeOf(this, new.target.prototype);
	}

	// Serialize the error for consistent API responses
	abstract serialize(): { message: string; field?: string }[];
}
