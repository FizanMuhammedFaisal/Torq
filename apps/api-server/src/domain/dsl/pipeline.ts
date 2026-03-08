// orcastrates parsing , version deteching , validating dsl, validating semantic and more
import { SpecParser } from './parser';
import type { ISpecParser, SpecType } from './types';
import { VersionDetector } from './versionDetector';

export class DSLPipeline {
    private specParser = new SpecParser()
    private versionDetector = new VersionDetector()
    constructor(private parser: ISpecParser) { }
    process(raw: string, format: SpecType) {

        this.specParser.validate(this.parser, format, raw)

        const version = this.versionDetector.detect(raw)

    }
}
