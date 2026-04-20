import type { IWorkflowRunRepository } from '@/application/port/repository/workflowRun.interface';
import type { WorkflowRunSnapshot } from '@/domain/entities/workflowRunSnapshot';
import { Envconfig } from '@/config/envconfig';
import { customObjectsClient } from '@/infrastructure/k8s/client';
import { ApiException } from '@kubernetes/client-node';
import type { CustomObjectsApi } from '@kubernetes/client-node';
import { injectable } from 'tsyringe';
import {
	toDomainWorkflowRun,
	type WorkflowRunK8s,
} from '@/infrastructure/k8s/watchers/mappers/workflowRunSnapshot.mapper';
import { logger } from '@/infrastructure/logger/logger';

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
		} catch (err) {
			if (err instanceof ApiException) {
				// ApiException.code  — HTTP status (number)
				// ApiException.body  — parsed K8s Status object, has .message
				const status = err.code;
				const msg = (err.body as { message?: string })?.message ?? err.message;

				if (status === 409) {
					// Duplicate name — caller should treat this as idempotent or surface to user
					throw new Error(`Conflict: A WorkflowRun with this name already exists.`);
				}
				if (status === 422) {
					throw new Error(`Validation Failed: The CRD manifest is invalid. ${msg}`);
				}
				throw new Error(`Kubernetes API error ${status}: ${msg}`);
			}

			// Network / TLS / timeout — API server unreachable
			if (err instanceof Error) {
				throw new Error(`Failed to reach Kubernetes API: ${err.message}`);
			}
			throw new Error('An unknown error occurred while creating the WorkflowRun');
		}
	}

	async get(name: string, namespace: string): Promise<WorkflowRunSnapshot> {
		try {
			const raw = await this.customObjectsClient.getNamespacedCustomObject({
				group: Envconfig.k8s.group,
				version: Envconfig.k8s.version,
				plural: Envconfig.k8s.plural,
				namespace,
				name,
			}) as WorkflowRunK8s;
			return toDomainWorkflowRun(raw);
		} catch (err) {
			if (err instanceof ApiException) {
				const status = err.code;
				const msg = (err.body as { message?: string })?.message ?? err.message;

				if (status === 404) {
					logger.warn({ name, namespace }, '[WorkflowRunRepository] WorkflowRun not found');
					throw new Error(`WorkflowRun "${name}" not found in namespace "${namespace}"`);
				}
				throw new Error(`Kubernetes API error ${status}: ${msg}`);
			}
			if (err instanceof Error) {
				throw new Error(`Failed to reach Kubernetes API: ${err.message}`);
			}
			throw new Error('An unknown error occurred while fetching the WorkflowRun');
		}
	}
}
