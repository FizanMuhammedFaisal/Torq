import type { IWorkflowRunRepository } from '@/application/port/repository/workflowRun.interface';
import type { IWorkflowRunDispatcherService } from '@/application/port/services/workflowRunDispatcher.interface';
import { TOKENS } from '@/config/di/tokens';
import type * as k8s from '@kubernetes/client-node';
import type { Workflow } from '@/domain/entities/workflow';
import { inject, injectable } from 'tsyringe';
import { Envconfig } from '@/config/envconfig';
@injectable()
export class WorkflowRunDispatcherService implements IWorkflowRunDispatcherService {
	constructor(
		@inject(TOKENS.WorkflowRunRepository) private workflowRunRepository: IWorkflowRunRepository,
	) { }
	async create(run: Workflow): Promise<void> {
		// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#objectmeta-v1-meta
		interface WorkflowRunCustomResource extends k8s.KubernetesObject {
			apiVersion: string;
			kind: string;
			metadata: k8s.V1ObjectMeta;
			spec: Workflow;
		}

		const manifest: WorkflowRunCustomResource = {
			// https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api-conventions.md#resources
			apiVersion: `${Envconfig.k8s.group}/${Envconfig.k8s.version}`,
			kind: Envconfig.k8s.kind,
			metadata: {
				// https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
				name: `run-${run.workflowId.toLowerCase()}`,
				namespace: Envconfig.k8s.namespace,
				labels: {
					'torq.dev/workflow': run.workflowId,
					'torq.dev/version': run.versionId,
				},
				// Finalizer keeps the CRD alive until CleanUpService removes it.
				// K8s sets deletionTimestamp instead of immediately deleting,
				// which triggers MODIFIED event → Reconciler → CleanUpService → removeFinalizer.
				finalizers: ['torq.dev/cleanup'],
			},
			spec: {
				workflowId: run.workflowId,
				versionId: run.versionId,
				torqVersion: run.torqVersion,
				triggerType: run.triggerType,
				createdAt: run.createdAt,
			},
		};
		await this.workflowRunRepository.create(manifest);
	}
}
