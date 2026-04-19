import type { V1Container, V1Job, V1Volume } from '@kubernetes/client-node';
import type { IJobBuilder } from '../interface/jobBuilderHanlder.interface';
import type { TorqJob, TorqJobSteps } from '@/domain/entities/job/job';
import { ReconcilerFailureError } from '@/infrastructure/errors/FailureError';

export class V1AlphaJobBuilder implements IJobBuilder {
    buildJob(job: TorqJob): V1Job {
        if (job.torqVersion !== 'v1alpha') {
            throw new ReconcilerFailureError(
                `Unsupported torqVersion ${job.torqVersion} for job builder`,
                'UNSUPPORTED_VERSION',
            );
        }
        const jobName = this.jobName(job);
        return {
            apiVersion: 'batch/v1',
            kind: 'Job',
            metadata: {
                name: jobName,
                namespace: job.namespace,
                labels: this.labels(job),
                annotations: {}, //skipping for now
                ownerReferences: [], // TODO: set to WorkflowRun8 CRD — enables cascade delete
            },
            spec: {
                backoffLimit: 2,
                ttlSecondsAfterFinished: 300,
                // the pod config
                template: {
                    metadata: {
                        labels: this.labels(job),
                    },
                    spec: {
                        restartPolicy: 'OnFailure',
                        serviceAccountName: 'torq-job-runner',
                        initContainers: [
                            // this.buildLogSidecarContainer(job), // moved to deamonset node wide
                            ...this.InitStepContainers(job)
                        ],
                        containers: [this.completionContainer()], // alteast one is reqruied
                        volumes: this.volumes()
                    },

                },
            },
        };
    }
    private jobName(job: TorqJob): string {
        // must be DNS-1123 compliant, unique per run+job
        // k8s names: max 63 chars, lowercase, alphanumeric + hyphens
        // ulids are case insensitive
        return `torq-${job.workflowRunId.toLowerCase()}-${job.id.toLowerCase()}`
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .slice(0, 63);
    }
    private labels(job: TorqJob): Record<string, string> {
        return {
            'app.kubernetes.io/managed-by': 'torq',
            'torq/workflow-run-id':   job.workflowRunId,
            'torq/workflow-run-name': job.workflowRunName,
            'torq/job-id':           job.id,
            'collect-logs':          'true',
        };
        // job watcher filters on managed-by=torq
        // torq/workflow-run-name is the CRD name — used by JobWatcher to patch step status
    }
    // private buildLogSidecarContainer(job: TorqJob): V1Container {
    //     return {
    //         name: 'torq-log-aggregator',
    //         image: "image of the service",//TODO
    //         restartPolicy: 'Always',// this is waht makes this a sidecar
    //         env: [
    //             { name: 'WORKFLOW_RUN_ID', value: job.workflowRunId },
    //             {
    //                 name: 'REDIS_URL',
    //                 valueFrom: {
    //                     // need to add as secrect to cluster
    //                     secretKeyRef: { name: 'torq-secrets', key: 'redis-url' },
    //                 },
    //             },
    //         ],
    //         volumeMounts: [
    //             { name: 'logs', mountPath: '/var/log/torq' },
    //         ],
    //         resources: {
    //             requests: { cpu: '50m', memory: '64Mi' },
    //             limits: { cpu: '100m', memory: '128Mi' },
    //         },
    //     }
    // }
    private completionContainer(): V1Container {
        // writes DONE sentinel so sidecar knows to flush and exit
        return {
            name: 'done',
            image: 'alpine:latest',
            command: ['sh', '-c', 'echo done > /var/log/torq/DONE && sleep 5'],
            volumeMounts: [
                { name: 'logs', mountPath: '/var/log/torq' },
            ],
        };
    }
    private volumes(): V1Volume[] {
        return [
            {
                name: 'workspace',
                emptyDir: {
                    sizeLimit: '1Gi', // hardcoded for now later can be dynamic
                },
            },
            {
                name: 'logs',
                emptyDir: {
                    sizeLimit: '500Mi',
                },
            },
        ]
    }
    private InitStepContainers(job: TorqJob): V1Container[] {
        return job.steps.map((step) => this.makeInitStepContainer(job, step))
    }
    private makeInitStepContainer(job: TorqJob, step: TorqJobSteps): V1Container {
        return {
            name: `step-${step.index}`,
            image: job.image,
            command: ['sh', '-c', step.run],
            volumeMounts: [
                { name: 'workspace', mountPath: '/workspace' },
                { name: 'logs', mountPath: '/var/log/torq' },
            ],
            resources: {
                requests: { cpu: '100m', memory: '256Mi' },
                limits: { cpu: '500m', memory: '512Mi' },
            },
            // All env vars (including secret values already merged in by the handler)
            env: [
                ...Object.entries(job.envs).map(([name, value]) => ({ name, value })),
            ],
            workingDir: '/workspace',
        }
    }
}
