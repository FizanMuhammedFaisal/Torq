import { IJobService } from "@/application/port/services/jobService.interface";
import { type IJobBuilderVersionRouter } from "../k8s/jobs/interface/jobRouter.inteface";
import { TOKENS } from "@/config/di/tokens";
import inject from "tsyringe/dist/typings/decorators/inject";

export class JobService implements IJobService {
    constructor(
        @inject(TOKENS.JobHandlerVersionRouter) private jobHandlerVersionRouter: IJobBuilderVersionRouter
    ) {

    }
    createJob(job: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}