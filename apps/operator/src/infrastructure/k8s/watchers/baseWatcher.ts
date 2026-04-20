import { logger } from '@/infrastructure/logger/logger';

export abstract class BaseWatcher {
	protected lastResourceVersion: string | undefined;
	private retryCount = 0;
	private isWatching = false;
	private watchStartedAt: number | undefined;

	abstract startWatch(): Promise<void>;

	public async start(): Promise<void> {
		if (this.isWatching) return;
		this.isWatching = true;
		await this.startWatch();
	}

	protected markWatchStarted(): void {
		this.watchStartedAt = Date.now();
	}

	public getRetryDelay(): number {
		const maxDelay = 30000;
		const delay = 1000 * 2 ** this.retryCount;
		return Math.min(delay, maxDelay);
	}

	public async stop(): Promise<void> {
		this.isWatching = false;
		logger.info({ 'watcher stopped for': this.constructor.name });
	}
	public hanldeDisconnect(err: unknown) {
		// 410 Gone = resourceVersion too old — must clear it and relist
		if (this.isGoneError(err)) {
			this.lastResourceVersion = undefined;
		}
		if (!this.isWatching) return;

		// If the watch stayed healthy for >5s, treat this as a fresh start for
		// backoff purposes — a quick transient blip shouldn't max the retry delay.
		const uptime = this.watchStartedAt ? Date.now() - this.watchStartedAt : 0;
		if (uptime > 5000) {
			this.retryCount = 0;
		}

		const delay = this.getRetryDelay();
		logger.error({
			'watcher disconnected': err,
			'will retry in': delay,
			resourceVersion: this.lastResourceVersion,
		});
		this.retryCount++;
		setTimeout(() => {
			this.startWatch();
		}, delay);
	}
	// https://kubernetes.io/docs/reference/using-api/api-concepts/#410-gone-responses
	private isGoneError(error: unknown): boolean {
		// 410 Gone = resourceVersion is too old (compacted out of etcd).
		// biome-ignore lint/suspicious/noExplicitAny: false pasittive
		return (error as any)?.statusCode === 410;
	}
}
