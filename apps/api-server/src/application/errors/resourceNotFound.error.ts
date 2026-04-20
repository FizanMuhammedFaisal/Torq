import { AppError } from './appError.abstract';
import { DOMAIN_ERROR_CODES } from '@/domain/errors/DOMAIN_ERROR_CODES';

export class ResourceNotFoundError extends AppError {
	constructor(resource: string, id: string) {
		super(DOMAIN_ERROR_CODES.NOT_FOUND, `${resource} with id ${id} not found`);
		this.name = 'ResourceNotFoundError';
	}

	serialize(): { message: string; field?: string }[] {
		return [
			{
				message: this.message,
			},
		];
	}
}
