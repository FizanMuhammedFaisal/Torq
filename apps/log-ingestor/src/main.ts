import 'reflect-metadata';
import 'dotenv/config';
import { RedisClient } from './redis/client';
import { Server } from './server';

const redis = new RedisClient();
redis.getClient();
const server = new Server(redis);

async function main() {
	await server.start();
}
async function close(signal: string) {
	console.log(`[ingestor] ${signal} received`);

	server.stop();
}
process.on('SIGTERM', () => close('SIGTERM'));
process.on('SIGINT', () => close('SIGINT'));
main();
