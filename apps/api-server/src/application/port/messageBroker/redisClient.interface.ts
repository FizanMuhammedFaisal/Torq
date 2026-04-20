import type { RedisClientType } from 'redis';

export interface IRedisClient {
	getClient(): Promise<RedisClientType>;
	closeClient(): Promise<void>;
}
