import type { TriggerType } from './workflow';
export interface Secrets {
    name: string;
    value: string;
}
export class WorkflowSpec {
    private constructor(
        public readonly workflowId: string,
        public readonly versionId: string,
        public readonly torqVersion: string,
        public readonly triggerType: TriggerType,
        public readonly spec: Record<string, unknown>,
        public readonly secrets: Secrets[],
        public readonly createdAt: Date,
    ) { }
    static create({
        workflowId,
        versionId,
        torqVersion,
        triggerType,
        spec,
        secrets,
        createdAt,
    }: {
        workflowId: string,
        versionId: string,
        torqVersion: string,
        triggerType: TriggerType,
        spec: Record<string, unknown>,
        secrets: Secrets[],
        createdAt: Date,
    }): WorkflowSpec {
        return WorkflowSpec.create({
            workflowId,
            versionId,
            torqVersion,
            triggerType,
            spec,
            secrets,
            createdAt,
        })
    }
}
