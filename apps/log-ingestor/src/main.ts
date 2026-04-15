import 'reflect-metadata'
import { RedisClient } from "./redis/client";
import { Server } from "./server";

async function main() {
    const redis = new RedisClient()
    redis.getClient()
    const server = new Server(redis)
    await server.start()
}

main()