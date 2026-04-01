import type { IReconciliationHandler } from '../port/reconciler/reconciliationHandler.interface';
import type { IReconcilerVersionRouter } from '../port/reconciler/versionRouter.interface';

export class ReconcilerVersionRouter implements IReconcilerVersionRouter {
	private handlers: Map<string, IReconciliationHandler>;
	constructor() {
		this.handlers = new Map<string, IReconciliationHandler>([]);
	}
	resolve(torqVersion: string): IReconciliationHandler | undefined {
		if (this.handlers.get(torqVersion)) {
			return this.handlers.get(torqVersion);
		} else {
			return undefined;
		}
	}
	supported(): string[] {
		return Array.from(this.handlers.keys());
	}
}
