import type { RedisClientType } from 'redis';
import { createClient } from 'redis';
import type { RedisClientInterface } from './Client.interface';
import { Envconfig } from '@/config/envconfig';
import { logger } from '../logger/logger';

export class RedisClient implements RedisClientInterface {
	private static instance: RedisClientInterface;
	private client: RedisClientType | null = null;
	private isConnecting = false;

	public static getInstance(): RedisClientInterface {
		if (!RedisClient.instance) {
			RedisClient.instance = new RedisClient();
		}
		return RedisClient.instance;
	}

	public async getClient(): Promise<RedisClientType> {
		if (this.client?.isReady) {
			return this.client;
		}

		if (this.isConnecting) {
			logger.warn('RedisConnectionManager: Connection already in progress. Waiting...');
			let attempts = 0;
			while (this.isConnecting && attempts < 100) {
				await new Promise((resolve) => setTimeout(resolve, 50));
				attempts++;
			}
			if (this.client?.isReady) {
				return this.client;
			}
			throw new Error('Redis connection attempt timed out or failed to establish concurrently.');
		}

		this.isConnecting = true;
		try {
			if (!this.client) {
				this.client = createClient({ url: Envconfig.redis.url });
				this.client.on('error', (err) => logger.error({ err, url: Envconfig.redis.url }, 'Redis Client Error:'));
				this.client.on('connect', () => logger.info('Redis Client Connected.'));
				this.client.on('reconnecting', () => logger.info('Redis Client Reconnecting...'));
				this.client.on('end', () => logger.info('Redis Client Disconnected.'));
			}
			if (!this.client.isOpen) {
				await this.client.connect();
				logger.info('Redis client connected successfully.');
			}
			return this.client;
		} catch (err) {
			this.client = null;
			throw err;
		} finally {
			this.isConnecting = false;
		}
	}
	public async closeClient(): Promise<void> {
		if (this.client?.isReady) {
			await this.client.quit();
			logger.info('Redis client disconnected.');
			this.client = null;
		}
	}
}
