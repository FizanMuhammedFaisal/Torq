import { Registry } from '@/domain/registry';
import type { IJobBuilder } from './interface/jobBuilderHanlder.interface';
import type { IJobBuilderVersionRouter } from './interface/jobRouter.inteface';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';



@injectable()
export class JobBuilderRouter implements IJobBuilderVersionRouter {
    private builders: Map<Registry, IJobBuilder>;
    constructor(@inject(TOKENS.V1AlphaJobBuilder) private v1AlphaJobBuilder: IJobBuilder) {
        this.builders = new Map<Registry, IJobBuilder>([[Registry.v1alpha, this.v1AlphaJobBuilder]]);
    }
    resolve(torqVersion: string): IJobBuilder | undefined {
        if (this.builders.has(torqVersion as Registry)) {
            return this.builders.get(torqVersion as Registry);
        } else {
            return undefined;
        }
    }
    supported(): string[] {
        return Array.from(this.builders.keys());
    }
}
