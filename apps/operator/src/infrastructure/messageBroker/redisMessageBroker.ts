import type { RedisClientInterface } from './Client.interface';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import { logger } from '@/infrastructure/logger/logger';

export interface WorkflowRunEvent {
	stepName?: string;
	status: string;   // Succeeded | Failed | Running | Cancelled
	reason?: string;
}

export interface IPublisher {
	publish(workflowRunName: string, event: WorkflowRunEvent): Promise<void>;
}

/**
 * Publishes WorkflowRun state events to Redis Streams.
 *
 * Stream key: state:{workflowRunName}
 *
 * The API server subscribes to this stream to:
 *   - update its WorkflowRun read model (Postgres)
 */
@injectable()
export class RedisPublisher implements IPublisher {
	constructor(
		@inject(TOKENS.RedisClient) private redisClientWrapper: RedisClientInterface,
	) { }

	async publish(workflowRunName: string, event: WorkflowRunEvent): Promise<void> {
		const streamKey = `state:${workflowRunName}`;
		const fields: Record<string, string> = {
			status: event.status,
			ts: new Date().toISOString(),
		};
		if (event.stepName) fields.stepName = event.stepName;
		if (event.reason) fields.reason = event.reason;

		try {
			const client = await this.redisClientWrapper.getClient();
			await client.xAdd(streamKey, '*', fields);
			logger.debug({ streamKey, event }, '[publisher] event published');
		} catch (err) {
			// Non-fatal — the reconciler can still proceed.
			// The CRD is the source of truth; the API server can re-sync from it.
			logger.error({ err, streamKey, event }, '[publisher] failed to publish event to Redis');
		}
	}
}
