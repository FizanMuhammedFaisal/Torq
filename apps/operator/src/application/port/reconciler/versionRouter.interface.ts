import type { IVersionHanlder } from './versionHanlder.interface';

export interface IReconcilerVersionRouter {
	resolve(torqVersion: string): IVersionHanlder | undefined;
	supported(): string[];
}
