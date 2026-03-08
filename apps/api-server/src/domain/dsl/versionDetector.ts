import { DSLVersionError } from '../errors/dslVersionError';
import { SUPPORTED_VERSIONS, type SupportedVersion } from './versions/registry';

export class VersionDetector {
    detect(raw: unknown): SupportedVersion {
        if (typeof raw !== 'object') {
            throw new DSLVersionError('Invalid Spec Format.');
        }
        const doc = raw as Record<string, unknown>;

        if (!doc.version) {
            throw new DSLVersionError('Missing required field: version');
        }
        if (!SUPPORTED_VERSIONS.includes(doc.version as SupportedVersion)) {
            throw new DSLVersionError(
                `Unsupported version "${doc.version}". ` + `Supported: ${SUPPORTED_VERSIONS.join(', ')}`,
            );
        }

        return doc.version as SupportedVersion;
    }
}
