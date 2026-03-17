import { DomainError } from './domainError.abstract';
import { DOMAIN_ERROR_CODES } from './DOMAIN_ERROR_CODES';
import type { ValidationIssue } from '../dsl/types';

export class SemanticValidationError extends DomainError {
	constructor(
		message: string,
		private issues: ValidationIssue[],
	) {
		super(DOMAIN_ERROR_CODES.SEMANTIC_VALIDATION_ERROR, message);
	}

	serialize() {
		return [{ message: this.message, issues: this.issues }];
	}
}
