import type { RedisClientType } from 'redis';
import { createClient } from 'redis';
import { logger } from '../logger/logger';
import type { RedisClientInterface } from './redis';
import { Envconfig } from '../envConfig';

export class RedisClient implements RedisClientInterface {
    private static instance: RedisClientInterface;
    private client: RedisClientType | null = null;
    private isConnecting = false;
    private isReadisReady = false
    public isReady() {
        return this.isReadisReady
    }
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
            logger.info('RedisConnectionManager: Connection already in progress. Waiting...');
            await new Promise((resolve) => setTimeout(resolve, 50));
            if (this.client?.isReady) {
                return this.client;
            } else {
                throw new Error('Redis connection attempt timed out or failed to establish concurrently.');
            }
        }
        this.isConnecting = true;
        try {
            if (!this.client) {
                this.client = createClient({ url: Envconfig.redis.url });
                this.client.on('error', (err) => {
                    this.isReadisReady = false
                    logger.error('Redis Client Error:', err)
                });
                this.client.on('ready', (err) => this.isReadisReady = true);
                this.client.on('connect', () => logger.info('Redis Client Connected.'));
                this.client.on('reconnecting', () => {
                    this.isReadisReady = false
                    logger.info('Redis Client Reconnecting...')
                });
                this.client.on('end', () => {
                    this.isReadisReady = false
                    logger.info('Redis Client Disconnected.')
                });
            }
            if (!this.client.isReady) {
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