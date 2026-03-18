import { Envconfig } from './envconfig';

/**
 * RPC Server Configuration
 */
export const rpcConfig = {
    port: Envconfig.grpc.PORT as number,
    host: Envconfig.grpc.HOST,
    enableLogging: true,
} as const;
