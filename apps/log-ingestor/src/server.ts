import http from 'node:http';
import { Envconfig } from './envConfig';
import type { RedisClientInterface } from './redis/redis';
import { logger } from './logger/logger';
import type { FluentBitLog, LogEntry } from './types';

export class Server {
	private redisInstance: RedisClientInterface;
	private buffer: LogEntry[];
	private maxBufferSize = Envconfig.ingetionConfig.MAX_BUFFER_SIZE;
	private batchSize = Envconfig.ingetionConfig.BATCH_SIZE;
	private flushTimer: ReturnType<typeof setTimeout> | null = null;
	private flushRunning: boolean = false;
	private server: http.Server | null = null;
	constructor(redisInstance: RedisClientInterface) {
		this.redisInstance = redisInstance;
		this.buffer = [];
	}

	async start() {
		this.server = http.createServer((req, res) => {
			const url = new URL(req.url ?? '/', Envconfig.server.url);
			if (req.method === 'GET' && url.pathname === '/health') {
				const healthy = this.redisInstance.isReady() && this.buffer.length < this.maxBufferSize;
				res.writeHead(healthy ? 200 : 503, { 'Content-Type': 'application/json' });
				res.end(
					JSON.stringify({
						ok: healthy,
						redis: this.redisInstance.isReady(),
						bufferSize: this.buffer.length,
					}),
				);
				return;
			}
			if (req.method === 'POST' && url.pathname === '/ingest') {
				//  if buffer is 90 percen full, we can tell caller to back off
				// fluent bit can take 503 adn retry later
				if (this.buffer.length >= this.maxBufferSize * 0.9) {
					res.writeHead(503, { 'retry-after': '2' });
					res.end('overloaded');
					return;
				}
				const chunks: Buffer[] = [];

				req.on('data', (chunk: Buffer) => {
					chunks.push(chunk);
				});
				req.on('end', () => {
					const body = Buffer.concat(chunks).toString('utf8');
					const validTorqLogs: FluentBitLog[] = [];
					let accepted = 0;
					let dropped = 0;
					let logs;
					try {
						logs = JSON.parse(body) as FluentBitLog[];
						logger.info('parsedd');
					} catch {
						dropped++;
						logger.info(
							{ accepted, dropped, bufferSize: this.buffer.length },
							'[ingestor] POST /ingest',
						);
						res.writeHead(400);
						res.end('invalid JSON');
						return;
					}
					for (const rawLog of logs) {
						if (
							typeof rawLog !== 'object' ||
							rawLog === null ||
							typeof rawLog.date !== 'number' ||
							typeof rawLog.log !== 'string'
						) {
							dropped++;
							continue;
						}

						const labels = rawLog.kubernetes?.labels;

						if (!labels) {
							dropped++;
							continue;
						}

						const jobId = labels['torq/job-id'];
						const workflowRunId = labels['torq/workflow-run-id'];
						const isTorqPod = labels[Envconfig.ingetionConfig.WORKFLOW_RUN_LABEL];

						if (!jobId || !workflowRunId || !isTorqPod) {
							dropped++;
							continue;
						}

						// only if passed checks
						validTorqLogs.push(rawLog);
					}

					this.sortLogs(validTorqLogs)

					for (const log of validTorqLogs) {
						// already guareded
						const jobId = log.kubernetes!.labels!['torq/job-id'];
						const workflowRunId = log.kubernetes!.labels!['torq/workflow-run-id'];

						const streamKey = `logs:run:${workflowRunId}:job:${jobId}`;

						const queued = this.enqueue({ streamKey, log });
						if (queued) {
							accepted++;
						} else {
							// Enqueue queue might be full
							dropped++;
						}
					}

					logger.info(
						{ accepted, dropped, bufferSize: this.buffer.length },
						'[ingestor] POST /ingest',
					);
					res.writeHead(200);
					res.end('OK');
				});
				req.on('error', (err) => {
					logger.error({ err: err.message }, '[ingestor] request error');
					res.writeHead(400);
					res.end('bad request');
				});
				return;
			}

			res.writeHead(404);
			res.end('not found');
		});

		this.server.listen(Envconfig.server.port, () => {
			logger.info(`Server Started on ${Envconfig.server.url}`);
		});
	}
	private enqueue(entry: LogEntry): boolean {
		if (this.buffer.length >= this.maxBufferSize) return false;
		this.buffer.push(entry);
		if (this.buffer.length >= this.batchSize) {
			// Cancel the timer — we're triggering an immediate flush
			if (this.flushTimer) {
				clearTimeout(this.flushTimer);
				this.flushTimer = null;
			}
			this.flush().catch((err) => logger.error({ err }, '[ingestor] flush error'));
		} else {
			this.scheduleFlush();
		}
		return true;
	}

	// Flushes if currently not flushing. If more entries arrive during flush,
	// scheduleFlush() will trigger another pass.
	private async flush(): Promise<void> {
		if (this.flushRunning || this.buffer.length === 0) return;
		if (!this.redisInstance.isReady()) {
			logger.warn({ bufferSize: this.buffer.length }, '[ingestor] redis not ready, skipping flush');
			this.scheduleFlush();
			return;
		}
		this.flushRunning = true;
		const batch = this.buffer.splice(0, this.batchSize);
		try {
			await this.flushToRedis(batch);
			logger.info(
				{ count: batch.length, remaining: this.buffer.length },
				'[ingestor] flushed logs',
			);
		} catch (error) {
			// Requeue the batch if there's room, otherwise drop
			if (this.buffer.length + batch.length <= this.maxBufferSize) {
				this.buffer = [...batch, ...this.buffer];
				logger.warn({ bufferSize: this.buffer.length }, '[ingestor] requeued batch');
			} else {
				logger.error({ dropped: batch.length }, '[ingestor] buffer full, dropping logs');
			}
		} finally {
			this.flushRunning = false;
			// If more entries accumulated while we were flushing,keep flushing
			if (this.buffer.length > 0) this.scheduleFlush();
		}
	}

	private scheduleFlush() {
		if (this.flushTimer) return;
		this.flushTimer = setTimeout(async () => {
			this.flushTimer = null;
			await this.flush();
		}, Envconfig.ingetionConfig.FLUSH_INTERVAL_MS);
	}

	public async stop() {
		this.server?.close();
		if (this.flushTimer) {
			clearTimeout(this.flushTimer);
			this.flushTimer = null;
		}
		// Drain buffer before shutting down
		while (this.buffer.length > 0 && this.redisInstance.isReady()) {
			await this.flush();
		}
		if (this.buffer.length > 0) {
			logger.error({ lost: this.buffer.length }, '[ingestor] shutdown: lost logs — redis was down');
		}
		await this.redisInstance.closeClient();
		logger.info('[ingestor] clean shutdown complete');
		process.exit(0);
	}

	/**
	 * Writes a batch of log entries to Redis Streams using a pipeline.
	 *
	 * Stream key: logs:pod:{namespace}:{podName}  (one stream per pod)
	 * Stream entry fields:
	 *   - log:           the raw log line string
	 *   - container:     container name (for multi-container pods)
	 *   - ts:            original FluentBit timestamp (epoch ms)
	 *
	 * Using a pipeline (multi/exec) batches all xAdd calls into a single
	 * network round-trip — critical for high-throughput ingestion.
	 */
	async flushToRedis(batch: LogEntry[]): Promise<void> {
		const client = await this.redisInstance.getClient();
		const pipeline = client.multi();
		// filters and only send what is needed
		for (const entry of batch) {
			pipeline.xAdd(
				entry.streamKey,
				'*', // auto-generate stream ID
				{
					log: entry.log.log ?? '',
					container: entry.log.kubernetes?.container_name ?? '',
					ts: String(entry.log.date ?? Date.now()),
				},
			);
		}

		await pipeline.exec();
	}
	sortLogs(validTorqLogs: FluentBitLog[]): FluentBitLog[] {
		return validTorqLogs.sort((a, b) => {
			if (a.date === b.date) {
				// tie braeker since the steps names are 0-step,1-step
				const containerA = a.kubernetes?.container_name || '';
				const containerB = b.kubernetes?.container_name || '';
				return containerA.localeCompare(containerB);
			}
			return a.date - b.date;
		});

	}
}
