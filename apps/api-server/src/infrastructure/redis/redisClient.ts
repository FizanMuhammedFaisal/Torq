import { Envconfig } from '@/config/envconfig';
import { logger } from '@/infrastructure/logger/logger';
import { createClient, type RedisClientType } from 'redis';
import { injectable, singleton } from 'tsyringe';
import type { IRedisClient } from '@/application/port/messageBroker/redisClient.interface';

@singleton()
@injectable()
export class RedisClient implements IRedisClient {
	private client: RedisClientType | null = null;
	private isConnecting = false;

	public async getClient(): Promise<RedisClientType> {
		if (this.client?.isReady) {
			return this.client;
		}

		if (this.isConnecting) {
			logger.info('[RedisClient] Connection already in progress. Waiting...');
			// Busy wait with a limit to avoid infinite wait if connection fails
			let attempts = 0;
			while (this.isConnecting && attempts < 100) {
				await new Promise((resolve) => setTimeout(resolve, 50));
				attempts++;
			}
			
			if (this.client?.isReady) {
				return this.client;
			}
			throw new Error('[RedisClient] Connection attempt timed out or failed to establish concurrently.');
		}

		this.isConnecting = true;
		try {
			if (!this.client) {
				logger.info('[RedisClient] Initializing Redis connection...');
				this.client = createClient({
					url: Envconfig.redis.url,
					pingInterval: 5000,
					socket: {
						family: 4,
						reconnectStrategy: (retries) => Math.min(retries * 50, 500)
					}
				});

				this.client.on('error', (err) => {
					logger.error({ err }, '[RedisClient] Connection error');
				});

				this.client.on('connect', () => {
					logger.info('[RedisClient] Connected to Redis server');
				});

				this.client.on('reconnecting', () => {
					logger.warn('[RedisClient] Reconnecting to Redis server...');
				});

				this.client.on('ready', () => {
					logger.info('[RedisClient] Redis client is ready');
				});

				this.client.on('end', () => {
					logger.info('[RedisClient] Redis connection ended');
				});
			}

			if (!this.client.isOpen) {
				await this.client.connect();
			}
			
			return this.client;
		} catch (err) {
			logger.error({ err }, '[RedisClient] Failed to connect to Redis');
			this.client = null;
			throw err;
		} finally {
			this.isConnecting = false;
		}
	}

	public async closeClient(): Promise<void> {
		if (this.client?.isReady) {
			await this.client.quit();
			logger.info('[RedisClient] Disconnected from Redis');
			this.client = null;
		}
	}
}
