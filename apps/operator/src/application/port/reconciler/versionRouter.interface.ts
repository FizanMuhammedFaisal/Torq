import type { IReconciliationHandler } from './reconciliationHandler.interface';

export interface IReconcilerVersionRouter {
	resolve(torqVersion: string): IReconciliationHandler | undefined;
	supported(): string[];
}
