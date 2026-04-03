export interface IJobRepository {
	create(job: object): Promise<void>;
}
