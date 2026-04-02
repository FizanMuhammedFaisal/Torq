export class WorkflowVersion {
	private constructor(
		public readonly id: string,
		public workflowId: string,
		public version: number,
		public torqVersion: string,
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
		torqVersion,
		createdAt,
	}: {
		id: string;
		workflowId: string;
		version: number;
		torqVersion: string;
		spec: Record<string, unknown>;
		raw: string;
		createdAt: Date;
	}) {
		return new WorkflowVersion(id, workflowId, version, torqVersion, spec, raw, createdAt);
	}
}
