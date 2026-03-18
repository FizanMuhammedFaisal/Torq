import type { ConnectRouter } from '@connectrpc/connect';

export interface IRPCRouter {
	register(router: ConnectRouter): void;
}
