import { IJobBuilder } from "./jobBuilderHanlder.interface";


export interface IJobBuilderVersionRouter {
    resolve(torqVersion: string): IJobBuilder | undefined;
    supported(): string[];
}
