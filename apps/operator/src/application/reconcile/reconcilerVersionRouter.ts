import { inject } from 'tsyringe';
import type { IVersionHanlder } from '../port/reconciler/versionHanlder.interface';
import type { IReconcilerVersionRouter } from '../port/reconciler/versionRouter.interface';
import { TOKENS } from '@/config/di/tokens';

export class ReconcilerVersionRouter implements IReconcilerVersionRouter {

    private handlers: Map<string, IVersionHanlder>
    constructor(
    ) {
        this.handlers =
            new Map<string, IVersionHanlder>([


            ])

    }
    resolve(torqVersion: string): IVersionHanlder | undefined {
        if (this.handlers.get(torqVersion)) {
            return this.handlers.get(torqVersion)
        } else {
            return undefined
        }
    }
    supported(): string[] {
        return Array.from(this.handlers.keys())
    }
}
