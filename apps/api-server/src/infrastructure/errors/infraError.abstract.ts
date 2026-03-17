import { AppError } from '../../application/errors/appError.abstract';

export abstract class InfraError extends AppError {
	public readonly isTransient: boolean;

	constructor(code: string, message: string, isTransient: boolean = false) {
		super(code, message);
		this.isTransient = isTransient;
	}
}
