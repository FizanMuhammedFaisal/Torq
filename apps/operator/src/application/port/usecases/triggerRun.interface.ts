export interface ITriggerRun {
    execute(data): Promise<void>
}