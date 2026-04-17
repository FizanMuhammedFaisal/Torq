export interface FluentBitLog {
    date: number;
    log: string;
    kubernetes?: {
        podName?: string;
        nameSpaceName?: string;
        containerName?: string;
        lables?: Record<string, string>
    }
}
export interface LogEntry {
    workflowRunId: string;
    log: FluentBitLog
}