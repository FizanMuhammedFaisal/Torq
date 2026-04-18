import http from 'node:http'
import { Envconfig } from './envConfig'
import type { RedisClientInterface } from './redis/redis'
import { logger } from './logger/logger'
import type { FluentBitLog, LogEntry } from './types'



export class Server {
    private redisInstance: RedisClientInterface
    private buffer: LogEntry[]
    private maxBufferSize = Envconfig.ingetionConfig.MAX_BUFFER_SIZE
    private batchSize = Envconfig.ingetionConfig.BATCH_SIZE
    private flushTimer: ReturnType<typeof setTimeout> | null = null
    private flushRunning: boolean = false
    private server: http.Server | null = null
    constructor(redisInstance: RedisClientInterface) {
        this.redisInstance = redisInstance
        this.buffer = []
    }

    async start() {
        this.server = http.createServer((req, res) => {
            const url = new URL(req.url ?? '/', Envconfig.server.url)
            if (req.method === 'GET' && url.pathname === '/health') {
                const healthy = this.redisInstance.isReady() && this.buffer.length < this.maxBufferSize
                res.writeHead(healthy ? 200 : 503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: healthy, redis: this.redisInstance.isReady(), bufferSize: this.buffer.length }));
                return;
            }
            if (req.method === 'POST' && url.pathname === '/ingest') {
                //  if buffer is 90 percen full, we can tell caller to back off
                // fluent bit can take 503 adn retry later
                if (this.buffer.length >= this.maxBufferSize * 0.9) {
                    res.writeHead(503, { "retry-after": '2' });
                    res.end('overloaded');
                    return
                }
                const chunks: Buffer[] = [];

                req.on('data', (chunk: Buffer) => { chunks.push(chunk); });
                req.on('end', () => {
                    const body = Buffer.concat(chunks).toString('utf8');
                    const lines = body.split('\n');
                    let accepted = 0;
                    let dropped = 0;

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed) continue;

                        let log: FluentBitLog;
                        try {
                            log = JSON.parse(trimmed) as FluentBitLog;
                        } catch {
                            dropped++;
                            continue;
                        }

                        const workflowRunId = log.kubernetes?.labels?.[Envconfig.ingetionConfig.WORKFLOW_RUN_LABEL];
                        if (!workflowRunId) { dropped++; continue; }   // not a TORQ pod, ignore

                        const queued = this.enqueue({ workflowRunId, log });
                        if (queued) { accepted++; } else { dropped++; }
                    }

                    console.log(`[ingestor] POST /ingest — accepted: ${accepted} dropped: ${dropped} buffer: ${this.buffer.length}`);
                    res.writeHead(200);
                    res.end('OK');
                });
                req.on('error', (err) => {
                    console.error('[ingestor] request error:', err.message);
                    res.writeHead(400);
                    res.end('bad request');
                });

                return;
            }
            res.writeHead(404);
            res.end('not found');
        })


        this.server.listen(Envconfig.server.port, () => {
            logger.info(`Server Started on ${Envconfig.server.url}`)
        })
    }
    private enqueue(entry: LogEntry): boolean {
        if (this.buffer.length >= this.maxBufferSize) return false
        this.buffer.push(entry)
        if (this.buffer.length >= this.batchSize) {
            // Cancel the timer — we're triggering an immediate flush
            if (this.flushTimer) { clearTimeout(this.flushTimer); this.flushTimer = null; }
            this.flush().catch(err => console.error('[ingestor] flush error:', err));
        } else {
            this.scheduleFlush();
        }
        return true;
    }
    // flushes if currenlty not flsuhing and if therr is left after flush schdule flushes
    private async flush(): Promise<void> {
        if (this.flushRunning || this.buffer.length === 0) return
        if (!this.redisInstance.isReady()) {
            logger.warn(`[ingestor] redis not ready, skipping flush — buffer size:${this.buffer.length}`);
            this.scheduleFlush()
            return
        }
        this.flushRunning = true

        const batch = this.buffer.splice(0, this.batchSize)

        try {
            await this.flushToRedis(batch)
            logger.info(`[ingestor] flushed ${batch.length} logs | buffer remaining: ${this.buffer.length}`);

        } catch (error) {
            if (this.buffer.length + batch.length <= this.maxBufferSize) {
                this.buffer = [...batch, ...this.buffer];
                logger.warn('[ingestor] requeued batch, buffer size now:' + this.buffer.length);
            } else {
                logger.error(`[ingestor] buffer full (${this.maxBufferSize}), dropping ${batch.length} logs`);
            }
        } finally {
            this.flushRunning = false;
            // If more entries accumulated while we were flushing,keep flushing
            if (this.buffer.length > 0) this.scheduleFlush();
        }
    }
    private scheduleFlush() {
        if (this.flushTimer) return
        this.flushTimer = setTimeout(async () => {
            this.flushTimer = null;
            await this.flush()
        }, Envconfig.ingetionConfig.FLUSH_INTERVAL_MS)
    }
    public async stop() {
        this.server?.close()
        if (this.flushTimer) {
            clearTimeout(this.flushTimer)
            this.flushTimer = null
        }

        while (this.buffer.length > 0 && this.redisInstance.isReady()) {
            await this.flush()
        }
        if (this.buffer.length > 0) {
            console.error(`[ingestor] shutdown: lost ${this.buffer.length} logs — redis was down`);
        }
        await this.redisInstance.closeClient()
        console.log('[ingestor] clean shutdown complete');
        process.exit(0);
    }
    async flushToRedis(batch: LogEntry[]): Promise<void> {
        const grouped = new Map<string, FluentBitLog[]>();
        for (const entry of batch) {
            const list = grouped.get(entry.workflowRunId) ?? [];
            list.push(entry.log);
            grouped.set(entry.workflowRunId, list);
        }
        // flush 
    }
}

