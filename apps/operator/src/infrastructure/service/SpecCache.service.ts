import type { CacheConnectionError } from '@/application/errors/cacheConnectionError';
import type { CacheTimeoutError } from '@/application/errors/cacheTimeoutError';
import type { ICacheService } from '@/application/port/services/cache.interface';
import { LRUCache } from 'lru-cache';

const DEFAULT_TTL_MS = 20 * 60 * 1000; // 20 minutes — ensures stale specs are evicted after updates

export class SpecCacheService implements ICacheService {
	cache: LRUCache<string, Record<string, unknown>>;
	constructor() {
		this.cache = new LRUCache<string, Record<string, unknown>>({
			max: 500,
			maxSize: 50 * 1024 * 1024, // 50 MB hard limit
			ttl: DEFAULT_TTL_MS,
			allowStale: true,
			// a size calculation function for the cache
			sizeCalculation: (value) => {
				try {
					const str = JSON.stringify(value);
					if (!str) return 2; // Size of empty brackets/quotes
					// in V8 engine, characters generally take up 2 bytes.
					// miuch faster than Buffer.byteLength and very close to accurate.
					return str.length * 2;
				} catch (error) {
					// THE SAFETY NET: If stringify fails (e.g., circular reference),
					// This ensures bad objects quickly get kicked out of the 50MB cache
					return 50 * 1024;
				}
			},
		});
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
		ttlSeconds?: number,
	): Promise<CacheConnectionError | CacheTimeoutError | Error | null> {
		try {
			const ttl = ttlSeconds !== undefined ? ttlSeconds * 1000 : undefined;
			this.cache.set(key, value as Record<string, unknown>, ttl ? { ttl } : undefined);
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
