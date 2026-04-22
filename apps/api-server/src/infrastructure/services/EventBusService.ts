import type { IRedisClient } from '@/application/port/messageBroker/redisClient.interface';
import type { EventEntry, IEventBus } from '@/application/port/services/eventBus.interface';
import { TOKENS } from '@/config/di/tokens';
import { logger } from '@/infrastructure/logger/logger';
import { inject, injectable } from 'tsyringe';

@injectable()
export class EventBusService implements IEventBus {
	constructor(@inject(TOKENS.RedisClient) private redisClient: IRedisClient) { }
	async subscribeToEvents(
		topic: string,
		listenMs: number,
		count: number = 100,
		cursorId: string = '$',
	): Promise<EventEntry[] | null> {
		const client = await this.redisClient.getClient();
		const results = await client.xRead(
			{ key: topic, id: cursorId },
			{ BLOCK: listenMs, COUNT: count },
		);
		if (!results) return null;
		return results[0].messages.map(({ id, message }) => ({ id, fields: message }));
	}

	/**
	 * Creates a dedicated blocking subscription with its own Redis connection.
	 * Yields event batches as they arrive. Connection is automatically closed
	 * when the abort signal fires or the caller breaks out of the loop.
	 */
	async *streamEvents(
		topic: string,
		abort: AbortSignal,
		cursorId: string = '$',
	): AsyncGenerator<EventEntry[]> {
		const t0 = performance.now();
		const blockingClient = await this.redisClient.createBlockingClient();
		logger.info(`[EventBus] createBlockingClient took ${(performance.now() - t0).toFixed(1)}ms`);
		let cursor = cursorId;

		try {
			while (!abort.aborted) {
				const results = await blockingClient.xRead(
					{ key: topic, id: cursor },
					{ BLOCK: 5000, COUNT: 100 },
				);
				if (!results) continue;

				const entries: EventEntry[] = results[0].messages.map(({ id, message }) => ({
					id,
					fields: message,
				}));

				if (entries.length > 0) {
					cursor = entries[entries.length - 1].id;
					yield entries;
				}
			}
		} finally {
			await blockingClient.quit().catch((err) => {
				logger.warn({ err }, '[EventBus] Error closing blocking session');
			});
		}
	}

	async getRecentEvents(topic: string, count: number): Promise<EventEntry[]> {
		const client = await this.redisClient.getClient();
		const results = await client.xRevRange(topic, '+', '-', {
			COUNT: count,
		});
		return results.reverse().map(({ id, message }) => ({ id, fields: message }));
	}
	async getEventsBefore(topic: string, beforeId: string, count: number): Promise<EventEntry[]> {
		const client = await this.redisClient.getClient();
		const results = await client.xRevRange(topic, `(${beforeId}`, '-', {
			COUNT: count,
		});
		return results.reverse().map(({ id, message }) => ({ id, fields: message }));
	}
	async *getAllEvents(topic: string, chunkSize: number = 500): AsyncGenerator<EventEntry[]> {

		const client = await this.redisClient.getClient();

		let cursor = '-';

		while (true) {
			const results = await client.xRange(topic, cursor, '+', { COUNT: chunkSize });
			if (results.length === 0) break;
			yield results.map(({ id, message }) => ({ id, fields: message }));

			if (results.length < chunkSize) break; // last page

			// current last record cursor
			cursor = `(${results[results.length - 1].id}`;
		}
	}
}