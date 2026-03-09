// orcastrates parsing , version deteching , validating dsl, validating semantic and more
import { SpecValidationError } from '../errors/specValidationError';
import { SpecParser } from './parser';
import type { ISpecParser, SpecType } from './types';
import { VersionDetector } from './versionDetector';
import { isObject } from './versions/common/base';
import { getTorqValidationHanlder } from './versions/registry';
import { handler } from './versions/v1apha/handler';

export class DSLPipeline {
    private specParser = new SpecParser()
    private versionDetector = new VersionDetector()
    constructor(private parser: ISpecParser) { }
    async process(raw: string, format: SpecType): Promise<Record<string, unknown>> {

        this.specParser.validate(this.parser, format, raw)

        const version = this.versionDetector.detect(raw)

        const torqValidator = await getTorqValidationHanlder(version)
        //schema validation
        const validSpec = torqValidator.schemaValidate(raw)
        //semantics validator
        const spec = handler.semanticValidate(validSpec)
        if (!isObject(spec)) {
            throw new SpecValidationError('Invalid spec');
        }
        return spec
    }
}
