import { Registry } from '@/domain/registry';
import type { IReconciliationHandler } from '../port/reconciler/reconciliationHandler.interface';
import type { IReconcilerVersionRouter } from '../port/reconciler/versionRouter.interface';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';

@injectable()
export class ReconcilerVersionRouter implements IReconcilerVersionRouter {
	private handlers: Map<Registry, IReconciliationHandler>;
	constructor(
		@inject(TOKENS.V1AlphaReconciliationHandler)
		private v1AlphaReconciliationHandler: IReconciliationHandler,
	) {
		this.handlers = new Map<Registry, IReconciliationHandler>(
			[
				[Registry.v1alpha, this.v1AlphaReconciliationHandler]
			]
		);
	}
	resolve(torqVersion: string): IReconciliationHandler | undefined {
		if (this.handlers.has(torqVersion as Registry)) {
			return this.handlers.get(torqVersion as Registry);
		} else {
			return undefined;
		}
	}
	supported(): string[] {
		return Array.from(this.handlers.keys());
	}
}
