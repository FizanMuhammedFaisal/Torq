export interface VersionHandler {
	schemaValidate(raw: unknown): unknown; // internally typed per version
	semanticValidate(validated: unknown): unknown;
}
const REGISTRY: Record<string, () => Promise<VersionHandler>> = {
	v1alpha: () => import('./v1apha/handler').then((m) => m.handler),
};
// as of now it is on v1alpha
export type SupportedVersion = keyof typeof REGISTRY;

export const SUPPORTED_VERSIONS = Object.keys(REGISTRY) as SupportedVersion[];

export function getTorqValidationHanlder(version: SupportedVersion): Promise<VersionHandler> {
	//pass the correct version after importing its validator
	return REGISTRY[version]();
}
