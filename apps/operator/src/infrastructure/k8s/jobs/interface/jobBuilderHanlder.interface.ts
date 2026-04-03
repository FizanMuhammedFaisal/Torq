import { TorqJob } from "@/domain/entities/job/job";
import { V1Job } from "@kubernetes/client-node";

export interface IJobBuilder {
    buildJob(job: TorqJob): V1Job;
}