

type VersionValidator = { validate: (raw: unknown) => void };
const REGISTRY: Record<string, () => Promise<VersionValidator>> = {
    v1alpha: () => import('./v1apha/validator')
}
// as of now it is on v1alpha
export type SupportedVersion = keyof typeof REGISTRY


export const SUPPORTED_VERSIONS = Object.keys(REGISTRY) as SupportedVersion[];


export function getValidator(version: SupportedVersion): Promise<VersionValidator> {
    //pass the correct version after importing its validator
    return REGISTRY[version]()
}