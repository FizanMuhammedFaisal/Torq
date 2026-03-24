import type { CacheConnectionError } from '@/application/errors/cacheConnectionError';
import type { CacheTimeoutError } from '@/application/errors/cacheTimeoutError';

export interface ICacheService {
    get<T>(key: string): Promise<[CacheConnectionError | CacheTimeoutError | Error | null, T | null]>;

    set<T>(
        key: string,
        value: T,
        ttlSeconds?: number,
    ): Promise<CacheConnectionError | CacheTimeoutError | Error | null>;

    delete(key: string): Promise<CacheConnectionError | CacheTimeoutError | Error | null>;
}


