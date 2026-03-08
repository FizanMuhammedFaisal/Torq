import type { ISpecParser, SpecValidationResult } from '@/domain/dsl/types';
import yaml from 'yaml';

export class SpecValidationService implements ISpecParser {
	validateYaml = (input: string): SpecValidationResult => {
		try {
			const doc = yaml.parseDocument(input, { strict: true });
			if (doc.errors.length > 0) {
				return {
					valid: false,
					error: doc.errors.map((e) => e.message).join('; '),
				};
			}
			return { valid: true };
		} catch (err) {
			return {
				valid: false,
				error: err instanceof Error ? err.message : 'Invalid YAML',
			};
		}
	};

	validateJson = (input: string): SpecValidationResult => {
		try {
			JSON.parse(input);
			return { valid: true };
		} catch (err) {
			return {
				valid: false,
				error: err instanceof Error ? err.message : 'Invalid JSON',
			};
		}
	};
}
