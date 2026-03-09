export class WorkflowVersion {
	private constructor(
		public readonly id: string,
		public workflowId: string,
		public version: number,
		public spec: Record<string, unknown>,
		public raw: string,
		public createdAt: Date,
	) { }

	static create({
		id,
		workflowId,
		version,
		spec,
		raw,
		createdAt,
	}: {
		id: string;
		workflowId: string;
		version: number;
		spec: Record<string, unknown>;
		raw: string;
		createdAt: Date;
	}) {
		return new WorkflowVersion(id, workflowId, version, spec, raw, createdAt);
	}
}
