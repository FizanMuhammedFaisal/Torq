export type SpecValidationResult = {
    valid: boolean;
    error?: string;
};

export type ISpecParser = {
    validateYaml: (input: string) => SpecValidationResult;
    validateJson: (input: string) => SpecValidationResult;
};

export type SpecType = "yaml" | "json"

export interface ValidationIssue {
    path: string;
    message: string;
}

export type ValidTorqSpec = {}