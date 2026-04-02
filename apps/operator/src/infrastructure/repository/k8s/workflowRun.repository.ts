import type { IWorkflowRunRepository } from '@/application/port/repository/workflowRun.interface';
import { Envconfig } from '@/config/envconfig';
import { customObjectsClient } from '@/infrastructure/k8s/client';
import type { HttpError } from '@/presentation/error/httpError';
import type { CustomObjectsApi } from '@kubernetes/client-node';
import { injectable } from 'tsyringe';

@injectable()
export class WorkflowRunRepository implements IWorkflowRunRepository {
	private customObjectsClient: CustomObjectsApi;
	constructor() {
		this.customObjectsClient = customObjectsClient;
	}
	async create(manifest: object): Promise<void> {
		try {
			await this.customObjectsClient.createNamespacedCustomObject({
				group: Envconfig.k8s.group,
				plural: Envconfig.k8s.plural,
				version: Envconfig.k8s.version,
				namespace: Envconfig.k8s.namespace,
				body: manifest,
			});
		} catch (error: unknown) {
			const k8sError = error as HttpError;

			if (k8sError.statusCode && k8sError.body) {
				const k8sResponseBody = k8sError.body;

				if (k8sError.statusCode === 409) {
					// refer docs about object creation
					throw new Error(`Conflict: A workflow run with this name already exists.`);
				}

				if (k8sError.statusCode === 422) {
					throw new Error(
						`Validation Failed: The CRD manifest is invalid. ${k8sResponseBody.message}`,
					);
				}

				throw new Error(
					`Kubernetes API Error (${k8sError.statusCode}): ${k8sResponseBody.message}`,
				);
			}

			// Fallback for pure network errors (e.g., API server is down, timeout)
			if (error instanceof Error) {
				throw new Error(`Failed to reach Kubernetes API: ${error.message}`);
			}
			throw new Error('An unknown error occurred while creating the workflow run');
		}
	}
}
