import { SpecValidationError } from '../errors/specValidationError';
import type { ISpecParser, SpecType } from './types';

export class SpecParser {
	validate(
		validator: ISpecParser,
		specType: SpecType,
		workflowSpec: string,
	): Record<string, unknown> {
		if (specType === 'json') {
			const res = validator.validateJson(workflowSpec);
			if (!res.valid) {
				throw new SpecValidationError(res.error ?? 'Invalid Json spec');
			}
			return res.data as Record<string, unknown>;
		}
		if (specType === 'yaml') {
			const res = validator.validateYaml(workflowSpec);
			if (!res.valid) {
				throw new SpecValidationError(res.error ?? 'Invalid Yaml spec');
			}
			return res.data as Record<string, unknown>;
		}
		throw new SpecValidationError('Unsupported spec type');
	}
}
