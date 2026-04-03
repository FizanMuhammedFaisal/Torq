export interface IJobService {
    createJob(job: string): Promise<void>;
}