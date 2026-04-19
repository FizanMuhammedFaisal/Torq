export interface FluentBitLog {
    date: number;
    log: string;
    kubernetes?: {
        pod_name?: string;
        namespace_name?: string;
        container_name?: string;
        labels?: Record<string, string>;
        pod_ip?: string;
        node_name?: string;
    }
}

// LogEntry is what goes into the in-memory buffer before Redis flush.
// The stream key is per-pod so consumers can filter by pod.
export interface LogEntry {
    // e.g. "logs:pod:torq-system:my-pod-abc123"
    streamKey: string;
    log: FluentBitLog;
}