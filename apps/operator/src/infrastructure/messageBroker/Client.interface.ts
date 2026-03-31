import type { RedisClientType } from 'redis'

export interface RedisClientInterface {
    getClient: () => Promise<RedisClientType>
    closeClient: () => Promise<void>
}
