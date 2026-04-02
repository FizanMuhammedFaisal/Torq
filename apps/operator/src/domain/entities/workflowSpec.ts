export interface Secrets {
    name: string;
    value: string;
}
export class WorkflowSpec {
    private constructor(
        public readonly workflowId: string,
        public readonly versionId: string,
        public readonly spec: Record<string, unknown>,
        public readonly secrets: Secrets[],
        public readonly createdAt: Date,
    ) { }
    static create({
        workflowId,
        versionId,
        spec,
        secrets,
        createdAt,
    }: {
        workflowId: string,
        versionId: string,
        spec: Record<string, unknown>,
        secrets: Secrets[],
        createdAt: Date,
    }): WorkflowSpec {
        return new WorkflowSpec(
            workflowId,
            versionId,
            spec,
            secrets,
            createdAt,
        )
    }
}
