
import { SpecValidationError } from '../errors/specValidationError';
import type { ISpecParser, SpecType } from './types';

export class SpecParser {
    validate(validator: ISpecParser, specType: SpecType, workflowSpec: string) {
        if (specType === 'json') {
            const res = validator.validateJson(workflowSpec);
            if (!res.valid) {
                throw new SpecValidationError(res.error ?? 'Invalid spec');
            }
        }
        if (specType === 'yaml') {
            const res = validator.validateYaml(workflowSpec);
            if (!res.valid) {
                throw new SpecValidationError(res.error ?? 'Invalid spec');
            }
        }
    }
}
