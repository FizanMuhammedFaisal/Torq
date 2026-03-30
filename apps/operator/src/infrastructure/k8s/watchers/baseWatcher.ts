import { logger } from "@/infrastructure/logger/logger";
export abstract class BaseWatcher {
    protected lastResourceVersion: string | undefined
    private retryCount = 0;
    private isWatching = false;

    abstract startWatch(): Promise<void>;

    public async start(): Promise<void> {
        if (this.isWatching) return;
        this.isWatching = true;
        await this.startWatch();
    }

    public getRetryDelay(): number {
        const maxDelay = 30000;
        const delay = 1000 * 2 ** this.retryCount;
        return Math.min(delay, maxDelay);
    }

    public async stop(): Promise<void> {
        this.isWatching = false;
        logger.info({ 'watcher stopped for': this.constructor.name })
    }
    public hanldeDisconnect(err: unknown) {
        if (this.isGoneError(err)) {
            this.lastResourceVersion = undefined
        }
        if (!this.isWatching) return
        const delay = this.getRetryDelay()
        logger.error({ 'watcher disconnected': err, 'will retry in': delay, resourceVersion: this.lastResourceVersion })
        this.retryCount++
        setTimeout(() => {
            this.startWatch()
        }, delay)
    }
    private isGoneError(error: unknown): boolean {
        return (error as any)?.statusCode === 401

    }
}
