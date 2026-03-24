
export type RunPhase = 'Pending' | 'Running' | 'Succeeded' | 'Failed' | 'Cancelled'
export type StepStatus = 'Pending' | 'Scheduled' | 'Running' | 'Succeeded' | 'Failed'

export interface StepSpec {
    name: string
    needs: string[]
    runtime: { image: string }
    steps: { run: string }[]
    resources?: { cpu?: string; memory?: string }
    retry?: { attempts: number }
    timeout?: string
}

export interface RunSpec {
    steps: StepSpec[]
    failFast: boolean
    secrets: Secret[]
}

export interface Secret {
    name: string
    envName: string
    value: string
}

export interface StepState {
    status: StepStatus
    startedAt?: string
    completedAt?: string
    attempt: number
}

export class WorkflowRunSnapshot {
    private constructor(
        public readonly name: string,
        public readonly namespace: string,
        public readonly uid: string,
        public readonly metadata: {
            name: string
            namespace: string
            uid: string
            generation: number
            resourceVersion: string
            deletionTimestamp?: Date
            finalizers?: string[]
        },
        //desired state
        public readonly spec: {
            workflowId: string
            versionId: string
            torqVersion: string
            triggeredBy: string
            inputs?: Record<string, string>
        },
        //actual state
        public readonly status?: {
            phase: RunPhase
            startedAt?: string
            completedAt?: string
            reason?: string
            observedGeneration?: number
            steps: Record<string, StepState>
        }
    ) { }
    public static create(props: {
        name: string
        namespace: string
        uid: string
        metadata: {
            name: string
            namespace: string
            uid: string
            generation: number
            resourceVersion: string
            deletionTimestamp?: Date
            finalizers?: string[]
        },
        spec: {
            workflowId: string
            versionId: string
            torqVersion: string
            triggeredBy: string
            inputs?: Record<string, string>
        },
        status?: {
            phase: RunPhase
            startedAt?: string
            completedAt?: string
            reason?: string
            observedGeneration?: number
            steps: Record<string, StepState>
        }
    }) {
        return new WorkflowRunSnapshot(
            props.name,
            props.namespace,
            props.uid,
            props.metadata,
            props.spec,
            props.status
        )
    }


}