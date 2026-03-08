import type { VersionHandler } from '../registry';
import type { WorkflowV1Alpha } from './schema';
import { validate } from './schemaValidator';
import { semanticValidate } from './semanticValidator';

export const handler: VersionHandler = {
    schemaValidate(raw: unknown): WorkflowV1Alpha {
        return validate(raw);
    },
    semanticValidate(validated: unknown): void {
        semanticValidate(validated as WorkflowV1Alpha);
    },

};
