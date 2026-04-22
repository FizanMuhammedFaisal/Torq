import type { RedisClientType } from 'redis';

export interface IRedisClient {
	getClient(): Promise<RedisClientType>;
	createBlockingClient(): Promise<RedisClientType>;
	closeClient(): Promise<void>;
}
