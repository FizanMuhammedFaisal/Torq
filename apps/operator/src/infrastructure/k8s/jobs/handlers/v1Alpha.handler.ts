import { V1Job } from "@kubernetes/client-node";
import { IJobBuilder } from "../interface/jobBuilderHanlder.interface";
import { TorqJob } from "@/domain/entities/job/job";
import { ReconcilerFailureError } from "@/infrastructure/errors/FailureError";

export class V1AlphaJobBuilder implements IJobBuilder {
    buildJob(job: TorqJob): V1Job {

        if (job.torqVersion !== "v1alpha") {
            throw new ReconcilerFailureError(`Unsupported torqVersion ${job.torqVersion} for job builder`, "UNSUPPORTED_VERSION");
        }
        const jobName = this.jobName(job)
        return {
            apiVersion: "batch/v1",
            kind: "Job",
            metadata: {
                name: jobName,
                namespace: job.namespace,
                labels: this.labels(job),
                annotations: {}, //skipping for now
                ownerReferences: [], // TODO: set to WorkflowRun CRD — enables cascade delete
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
                        restartPolicy: "OnFailure",
                        serviceAccountName: 'torq-job-runner',
                        containers: []

                    }
                }

            }


        }
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
            'torq/workflow-run-id': job.workflowRunId,
            'torq/job-id': job.id,
        };
        // job watcher loop filters on managed-by=torq
    }
}