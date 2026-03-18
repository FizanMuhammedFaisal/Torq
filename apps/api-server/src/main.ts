/**
 * Torq - API Server
 */
/** biome-ignore-all lint/correctness/noUndeclaredVariables: false positive */

import 'reflect-metadata';
import { Envconfig } from './config/envconfig';
import type { HTTPServer } from './presentation/server';
import { container } from 'tsyringe';
import { TOKENS } from './config/di/tokens';
import type { GRpcServer } from './presentation/grpc/rpc-server';

console.log(' Torq API Server starting...');
console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(` Bun version: ${Bun.version}`);
console.log(` Torq version: ${Envconfig.app.version}`);

const server = container.resolve<HTTPServer>(TOKENS.HTTPServer);
const grpcServer = container.resolve<GRpcServer>(TOKENS.GRPCServer);

await Promise.all([server.start(), grpcServer.start()]);
