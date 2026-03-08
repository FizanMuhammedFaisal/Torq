export class WorkflowVersion {
	private constructor(
		public id: string,
		public workflowId: string,
		public version: number,
		public spec: string,
		public createdAt: Date,
	) {}

	static create({
		id,
		workflowId,
		version,
		spec,
		createdAt,
	}: {
		id: string;
		workflowId: string;
		version: number;
		spec: string;
		createdAt: Date;
	}) {
		return new WorkflowVersion(id, workflowId, version, spec, createdAt);
	}
}
