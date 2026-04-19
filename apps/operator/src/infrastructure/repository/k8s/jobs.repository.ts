import type { IJobRepository } from '@/application/port/repository/jobs.interface';
import { batchClient } from '@/infrastructure/k8s/client';
import { logger } from '@/infrastructure/logger/logger';
import { ApiException } from '@kubernetes/client-node';
import type { V1Job } from '@kubernetes/client-node';
import { injectable } from 'tsyringe';

@injectable()
export class JobRepository implements IJobRepository {
	async create(manifest: V1Job): Promise<{ created: boolean }> {
		const namespace = manifest.metadata?.namespace;
		const name = manifest.metadata?.name;

		if (!namespace || !name) {
			throw new Error('Job manifest is missing metadata.name or metadata.namespace');
		}

		try {
			await batchClient.createNamespacedJob({ namespace, body: manifest });
			logger.info({ jobName: name, namespace }, 'K8s Job created');
			return { created: true };
		} catch (err) {
			if (err instanceof ApiException && err.code === 409) {
				// Job already exists — idempotent, not an error.
				// This happens when the operator restarts and replays a CRD event.
				logger.debug({ jobName: name, namespace }, 'K8s Job already exists, skipping (idempotent)');
				return { created: false };
			}
			// Surface all other errors to the caller (handler will mark the step as Failed)
			throw err;
		}
	}
	async listByRun(workflowRunId: string, namespace: string): Promise<V1Job[]> {
		const result = await batchClient.listNamespacedJob({
			namespace,
			labelSelector: `torq/workflow-run-id=${workflowRunId}`,
		});
		return result.items ?? [];
	}
}
