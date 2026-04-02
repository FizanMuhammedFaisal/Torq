// orcastrates parsing , version deteching , validating dsl, validating semantic and more
import { SpecValidationError } from '../errors/specValidationError';
import { SpecParser } from './parser';
import type { ISpecParser, SpecType } from './types';
import { VersionDetector } from './versionDetector';
import { isObject } from './versions/common/base';
import { getTorqValidationHanlder } from './versions/registry';
import { handler } from './versions/v1apha/handler';

export class DSLPipeline {
	private specParser = new SpecParser();
	private versionDetector = new VersionDetector();
	constructor(private parser: ISpecParser) { }
	async process(raw: string, format: SpecType): Promise<[Record<string, unknown>, torqVersion: string]> {
		try {
			const parsedSpec = this.specParser.validate(this.parser, format, raw);
			const version = this.versionDetector.detect(parsedSpec);

			const torqValidator = await getTorqValidationHanlder(version);
			//schema validation
			const validSpec = torqValidator.schemaValidate(parsedSpec);
			//semantics validator
			const spec = handler.semanticValidate(validSpec);
			if (!isObject(spec)) {
				throw new SpecValidationError('Invalid spec');
			}
			return [spec, version];
		} catch (error) {
			// Re-throw DomainErrors so we don't lose the detailed issues list
			if (
				error instanceof SpecValidationError ||
				error?.constructor?.name === 'SemanticValidationError' ||
				error?.constructor?.name === 'SchemaValidationError'
			) {
				throw error;
			}
			throw new SpecValidationError(error instanceof Error ? error.message : 'Invalid spec');
		}
	}
}
