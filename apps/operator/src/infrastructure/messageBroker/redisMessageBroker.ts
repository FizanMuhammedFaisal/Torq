import type { RedisClientInterface } from './Client.interface';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import { logger } from '@/infrastructure/logger/logger';

import type { IPublisher, PublishResult } from '@/application/port/messageBroker/publisher.interface';

@injectable()
export class RedisPublisher implements IPublisher {
	constructor(
		@inject(TOKENS.RedisClient) private redisClientWrapper: RedisClientInterface,
	) { }

	/**
	 * Publish a message to a stream.
	 */
	async publish<T>(topic: string, message: T, stringify: boolean = false): Promise<PublishResult> {
		try {
			const client = await this.redisClientWrapper.getClient();

			if (stringify) {
				await client.xAdd(topic, '*', { data: JSON.stringify(message) });
			} else {
				// Assumes T is a flat object where values can be stringified easily
				const fields = Object.fromEntries(
					Object.entries(message as object).map(([k, v]) => [k, String(v)])
				);
				await client.xAdd(topic, '*', fields);
			}

			logger.debug({ topic, message }, '[publisher] event published');
			return { success: true };
		} catch (err) {
			logger.error({ err, topic }, '[publisher] failed to publish event to Redis');
			return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
		}
	}
}
