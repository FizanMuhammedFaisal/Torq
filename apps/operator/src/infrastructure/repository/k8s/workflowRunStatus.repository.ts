import type { IWorkflowRunStatusRepository } from '@/application/port/repository/workflowRunStatus.interface';
import type { RunPhase, StepState } from '@/domain/entities/workflowRunSnapshot';
import { Envconfig } from '@/config/envconfig';
import { customObjectsClient } from '@/infrastructure/k8s/client';
import { logger } from '@/infrastructure/logger/logger';
import { ApiException } from '@kubernetes/client-node';
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
				phase:              params.phase,
				steps:              params.steps,
				observedGeneration: params.observedGeneration,
				...(params.startedAt   !== undefined ? { startedAt:   params.startedAt   } : {}),
				...(params.completedAt !== undefined ? { completedAt: params.completedAt } : {}),
				...(params.reason      !== undefined ? { reason:      params.reason      } : {}),
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
		const MAX_RETRIES = 5;

		for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
			// GET the latest version of the object (includes resourceVersion for optimistic lock)
			const current = (await customObjectsClient.getNamespacedCustomObject({
				group:     Envconfig.k8s.group,
				version:   Envconfig.k8s.version,
				plural:    Envconfig.k8s.plural,
				namespace: params.namespace,
				name:      params.name,
			})) as Record<string, unknown>;

			const metadata       = (current?.metadata ?? {}) as Record<string, unknown>;
			const resourceVersion = metadata.resourceVersion as string | undefined;
			const currentStatus  = (current?.status ?? {}) as Record<string, unknown>;
			const currentSteps   = { ...(currentStatus.steps as Record<string, StepState> | undefined ?? {}) };
			currentSteps[params.stepName] = params.stepState;

			try {
				await customObjectsClient.patchNamespacedCustomObjectStatus({
					group:     Envconfig.k8s.group,
					version:   Envconfig.k8s.version,
					plural:    Envconfig.k8s.plural,
					namespace: params.namespace,
					name:      params.name,
					body: {
						// Include resourceVersion so K8s rejects this with 409 if another
						// write occurred between our GET and this PATCH (optimistic concurrency).
						metadata: { resourceVersion },
						status: {
							...currentStatus,
							steps: currentSteps,
						},
					},
				});

				logger.info(
					{ name: params.name, stepName: params.stepName, status: params.stepState.status, attempt },
					'WorkflowRun step status patched',
				);
				return; // success
			} catch (err) {
				if (err instanceof ApiException && err.code === 409) {
					// Conflict — another writer (e.g. a parallel job completion) updated the
					// object between our GET and PATCH. Retry with a fresh GET.
					logger.debug(
						{ name: params.name, stepName: params.stepName, attempt },
						'[status-repo] patchStepStatus conflict (409) — retrying',
					);
					continue;
				}
				// Any other error (422, 5xx, network) is not retryable
				throw err;
			}
		}

		throw new Error(
			`patchStepStatus: gave up after ${MAX_RETRIES} retries due to repeated 409 conflicts on "${params.name}/${params.stepName}"`,
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
