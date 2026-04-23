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
		// Quick check: is this stream already ended?
		// If STREAM_END is already the last entry, don't create a blocking connection.
		if (await this.isStreamEnded(topic)) {
			return;
		}

		const blockingClient = await this.redisClient.createBlockingClient();
		let cursor = cursorId;

		try {
			while (!abort.aborted) {
				const results = await blockingClient.xRead(
					{ key: topic, id: cursor },
					{ BLOCK: 5000, COUNT: 100 },
				);
				if (!results) continue;

				const entries: EventEntry[] = [];
				let streamEnded = false;

				for (const { id, message } of results[0].messages) {
					cursor = id;

					// Detect STREAM_END control entry from the ingestor
					if (message.__type === 'STREAM_END') {
						streamEnded = true;
						break; // Don't include this entry — it's a control signal
					}

					entries.push({ id, fields: message });
				}

				// Yield any real log entries that came before STREAM_END
				if (entries.length > 0) {
					yield entries;
				}

				if (streamEnded) break;
			}
		} finally {
			await blockingClient.quit().catch((err) => {
				logger.warn({ err }, '[EventBus] Error closing blocking session');
			});
		}
	}

	async getRecentEvents(topic: string, count: number): Promise<EventEntry[]> {
		const client = await this.redisClient.getClient();
		const results = await client.xRevRange(topic, '+', '-', { COUNT: count });
		// Build in reverse order in a single pass instead of reverse() + map()
		const entries: EventEntry[] = new Array(results.length);
		for (let i = results.length - 1, j = 0; i >= 0; i--, j++) {
			entries[j] = { id: results[i].id, fields: results[i].message };
		}
		return entries;
	}
	async getEventsBefore(topic: string, beforeId: string, count: number): Promise<EventEntry[]> {
		const client = await this.redisClient.getClient();
		const results = await client.xRevRange(topic, `(${beforeId}`, '-', { COUNT: count });
		const entries: EventEntry[] = new Array(results.length);
		for (let i = results.length - 1, j = 0; i >= 0; i--, j++) {
			entries[j] = { id: results[i].id, fields: results[i].message };
		}
		return entries;
	}
	async *getAllEvents(topic: string, chunkSize: number = 500): AsyncGenerator<EventEntry[]> {
		const client = await this.redisClient.getClient();
		let cursor = '-';

		while (true) {
			const results = await client.xRange(topic, cursor, '+', { COUNT: chunkSize });
			if (results.length === 0) break;

			// Single pass: filter control entries + map in one loop, no intermediate arrays
			const logEntries: EventEntry[] = [];
			for (let i = 0; i < results.length; i++) {
				const { id, message } = results[i];
				if (message.__type !== 'STREAM_END') {
					logEntries.push({ id, fields: message });
				}
			}

			if (logEntries.length > 0) {
				yield logEntries;
			}

			if (results.length < chunkSize) break;

			// cursor past the last record
			cursor = `(${results[results.length - 1].id}`;
		}
	}

	async isStreamEnded(topic: string): Promise<boolean> {
		const client = await this.redisClient.getClient();
		const lastEntries = await client.xRevRange(topic, '+', '-', { COUNT: 1 });
		return lastEntries.length > 0 && lastEntries[0].message.__type === 'STREAM_END';
	}
}