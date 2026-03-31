import type { CacheConnectionError } from '@/application/errors/cacheConnectionError';
import type { CacheTimeoutError } from '@/application/errors/cacheTimeoutError';
import type { ICacheService } from '@/application/port/services/cache.interface';
import { LRUCache } from 'lru-cache';
export class SpecCacheService implements ICacheService {

    cache: LRUCache<string, Record<string, unknown>>
    constructor() {
        this.cache = new LRUCache<string, Record<string, unknown>>({
            max: 500,
            maxSize: 50 * 1024 * 1024, // 50 MB hard limit
        })
    }
    async get<T>(
        key: string,
    ): Promise<[CacheConnectionError | CacheTimeoutError | Error | null, T | null]> {
        try {
            const value = this.cache.get(key);
            return [null, value as T];
        } catch (error) {
            return [error as Error, null];
        }
    }
    async set<T>(
        key: string,
        value: T,
        _ttlSeconds?: number,
    ): Promise<CacheConnectionError | CacheTimeoutError | Error | null> {
        try {
            this.cache.set(key, value as Record<string, unknown>);
            return null;
        } catch (error) {
            return error as Error;
        }
    }
    async delete(key: string): Promise<CacheConnectionError | CacheTimeoutError | Error | null> {
        try {
            this.cache.delete(key);
            return null;
        } catch (error) {
            return error as Error;
        }
    }
}
