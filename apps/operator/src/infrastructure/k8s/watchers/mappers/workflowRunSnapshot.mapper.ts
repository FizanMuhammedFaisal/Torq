import type {
    WorkflowRunSnapshot,
    RunPhase,
    StepState,
} from '@/domain/entities/WorkflowRunSnapshot';
import type { KubernetesObject } from '@kubernetes/client-node';

export interface WorkflowRunK8s extends KubernetesObject {
    spec: {
        workflowId: string;
        versionId: string;
        torqVersion: string;
        triggeredBy: string;
        inputs?: Record<string, string>;
    };
    status?: {
        phase?: RunPhase;
        startedAt?: string;
        completedAt?: string;
        reason?: string;
        observedGeneration?: number;
        steps?: Record<string, StepState>;
    };
}

export function toDomainWorkflowRun(raw: WorkflowRunK8s): WorkflowRunSnapshot {
    return {
        metadata: {
            name: raw.metadata?.name ?? '',
            namespace: raw.metadata?.namespace ?? '',
            uid: raw.metadata?.uid ?? '',
            generation: raw.metadata?.generation ?? 0,
            resourceVersion: raw.metadata?.resourceVersion ?? '',
            deletionTimestamp: raw.metadata?.deletionTimestamp,
            finalizers: raw.metadata?.finalizers ?? [],
        },
        spec: {
            workflowId: raw.spec.workflowId,
            versionId: raw.spec.versionId,
            torqVersion: raw.spec.torqVersion,
            triggeredBy: raw.spec.triggeredBy,
            inputs: raw.spec.inputs,
        },
        status: raw.status
            ? {
                phase: raw.status.phase ?? 'Pending',
                startedAt: raw.status.startedAt,
                completedAt: raw.status.completedAt,
                reason: raw.status.reason,
                observedGeneration: raw.status.observedGeneration,
                steps: raw.status.steps ?? {},
            }
            : undefined,
    };
}
