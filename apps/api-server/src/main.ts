/**
 * Torq - API Server
 */
/** biome-ignore-all lint/correctness/noUndeclaredVariables: false positive */

import 'reflect-metadata';
import { Envconfig } from './config/envconfig';
import type { HTTPServer } from './presentation/server';
import { container } from './config/di/container';
import { TOKENS } from './config/di/tokens';
import type { GRpcServer } from './presentation/grpc/rpc-server';
import { WorkflowRunStateConsumer } from './infrastructure/redis/WorkflowRunStateConsumer';
import { logger } from './infrastructure/logger/logger';

logger.info(' Torq API Server starting...');
logger.info(` Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(` Torq version: ${Envconfig.app.version}`);

const server = container.resolve<HTTPServer>(TOKENS.HTTPServer);
const grpcServer = container.resolve<GRpcServer>(TOKENS.GRPCServer);
const runStateConsumer = container.resolve(WorkflowRunStateConsumer);

await Promise.all([
	server.start(),
	grpcServer.start(),
	runStateConsumer.start()
]);
