/**
 * Torq - API Server
 */
/** biome-ignore-all lint/correctness/noUndeclaredVariables: false positive */

import 'reflect-metadata';
import { Envconfig } from './config/envconfig';
import { HTTPServer } from './presentation/server';

console.log(' Torq API Server starting...');
console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(` Bun version: ${Bun.version}`);
console.log(` Torq version: ${Envconfig.app.version}`);

const server = new HTTPServer();
await server.start();
