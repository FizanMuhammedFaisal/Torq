import http from 'node:http'
import { Envconfig } from './envConfig'
import type { RedisClientInterface } from './redis/redis'
import { logger } from './logger/logger'



export class Server {
    private redisInstance: RedisClientInterface
    private buffer: string[]
    private maxBufferSize = Envconfig.ingetionConfig.MAX_BUFFER_SIZE
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
        })

        this.server.listen(Envconfig.server.port, () => {
            logger.info(`Server Started on ${Envconfig.server.url}`)
        })
    }
}

