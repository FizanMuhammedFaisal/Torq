export interface IWorkflowSpecProvider {
    getSpec(workflowVersionId: string): Promise<Record<string, unknown>>;
}
