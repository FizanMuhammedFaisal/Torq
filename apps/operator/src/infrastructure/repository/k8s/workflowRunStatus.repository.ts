import type { IWorkflowRunStatusRepository } from '@/application/port/repository/workflowRunStatus.interface';
import type { RunPhase, StepState } from '@/domain/entities/workflowRunSnapshot';
import { Envconfig } from '@/config/envconfig';
import { customObjectsClient } from '@/infrastructure/k8s/client';
import { logger } from '@/infrastructure/logger/logger';
import { injectable } from 'tsyringe';

@injectable()
export class WorkflowRunStatusRepository implements IWorkflowRunStatusRepository {
	async patchStatus(params: {
		name: string;
		namespace: string;
		phase: RunPhase;
		steps: Record<string, StepState>;
		startedAt?: string;
		completedAt?: string;
		reason?: string;
		observedGeneration: number;
	}): Promise<void> {
		const body = {
			status: {
				phase: params.phase,
				steps: params.steps,
				startedAt: params.startedAt,
				completedAt: params.completedAt,
				reason: params.reason,
				observedGeneration: params.observedGeneration,
			},
		};

		await customObjectsClient.patchNamespacedCustomObjectStatus({
			group: Envconfig.k8s.group,
			version: Envconfig.k8s.version,
			plural: Envconfig.k8s.plural,
			namespace: params.namespace,
			name: params.name,
			body,
		});

		logger.debug(
			{ name: params.name, phase: params.phase },
			'WorkflowRun status patched',
		);
	}

	async patchStepStatus(params: {
		name: string;
		namespace: string;
		stepName: string;
		stepState: StepState;
	}): Promise<void> {
		// Read-modify-write: fetch current status so we don't clobber other steps.
		// The subsequent status patch triggers a new CRD MODIFIED event which
		// drives the next reconciliation pass.
		const current = (await customObjectsClient.getNamespacedCustomObject({
			group: Envconfig.k8s.group,
			version: Envconfig.k8s.version,
			plural: Envconfig.k8s.plural,
			namespace: params.namespace,
			name: params.name,
		})) as Record<string, unknown>;

		const currentStatus = (current?.status ?? {}) as Record<string, unknown>;
		const currentSteps = ({ ...(currentStatus.steps as Record<string, StepState> ?? {}) });
		currentSteps[params.stepName] = params.stepState;

		await customObjectsClient.patchNamespacedCustomObjectStatus({
			group: Envconfig.k8s.group,
			version: Envconfig.k8s.version,
			plural: Envconfig.k8s.plural,
			namespace: params.namespace,
			name: params.name,
			body: {
				status: {
					...currentStatus,
					steps: currentSteps,
				},
			},
		});

		logger.info(
			{ name: params.name, stepName: params.stepName, status: params.stepState.status },
			'WorkflowRun step status patched',
		);
	}

	async removeFinalizer(name: string, namespace: string, finalizerName: string): Promise<void> {
		const current = (await customObjectsClient.getNamespacedCustomObject({
			group: Envconfig.k8s.group,
			version: Envconfig.k8s.version,
			plural: Envconfig.k8s.plural,
			namespace,
			name,
		})) as Record<string, unknown>;

		const metadata = (current?.metadata ?? {}) as Record<string, unknown>;
		const finalizers = (metadata.finalizers as string[] | undefined) ?? [];
		const updated = finalizers.filter((f) => f !== finalizerName);

		await customObjectsClient.patchNamespacedCustomObject({
			group: Envconfig.k8s.group,
			version: Envconfig.k8s.version,
			plural: Envconfig.k8s.plural,
			namespace,
			name,
			body: { metadata: { finalizers: updated } },
		});

		logger.info({ name, finalizerName }, 'Finalizer removed from WorkflowRun');
	}
}
