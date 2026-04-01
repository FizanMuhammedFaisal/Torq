import type { IWorkflowRunRepository } from '@/application/port/repository/workflowRun.interface';
import type { IWorkflowRunDispatcherService } from '@/application/port/services/workflowRunDispatcher.interface';
import { TOKENS } from '@/config/di/tokens';
import type * as k8s from '@kubernetes/client-node';
import type { Workflow } from '@/domain/entities/workflowRun';

import { inject } from 'tsyringe';
import { Envconfig } from '@/config/envconfig';

export class WorkflowRunDispatcherService implements IWorkflowRunDispatcherService {
    constructor(
        @inject(TOKENS.WorkflowRunRepository) private workflowRunRepository: IWorkflowRunRepository,
    ) {

    }
    async create(run: Workflow): Promise<void> {

        // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#objectmeta-v1-meta
        interface WorkflowRunCustomResource extends k8s.KubernetesObject {
            apiVersion: string;
            kind: string;
            metadata: k8s.V1ObjectMeta;
            spec: Workflow;
        }

        const manifest: WorkflowRunCustomResource = {
            apiVersion: `${Envconfig.k8s.group}/${Envconfig.k8s.version}`,
            kind: Envconfig.k8s.kind,
            metadata: {
                // Perfect typing for K8s metadata!
                name: `run-${run.workflowId}`,
                namespace: Envconfig.k8s.namespace,
                labels: {
                    'torq.dev/workflow': run.workflowId,
                    'torq.dev/version': run.versionId
                }
            },
            spec: {
                workflowId: run.workflowId,
                versionId: run.versionId, gi
                torqVersion: run.torqVersion,
                triggerType: run.triggerType,
                createdAt: run.createdAt,
            }
        };
        await this.workflowRunRepository.create(manifest);
    }
}
