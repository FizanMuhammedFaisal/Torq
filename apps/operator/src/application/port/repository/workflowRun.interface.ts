export interface IWorkflowRunRepository {
    create(manifest: object): Promise<void>
}