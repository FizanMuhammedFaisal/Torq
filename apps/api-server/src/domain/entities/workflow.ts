export class Workflow {
	private constructor(
		public id: string,
		public identityId: string,
		public name: string,
		public createdAt: Date,
		public description?: string,
	) {}

	static create({
		id,
		identityId,
		name,
		description,
		createdAt,
	}: {
		id: string;
		identityId: string;
		name: string;
		createdAt: Date;
		description?: string;
	}) {
		return new Workflow(id, identityId, name, createdAt, description);
	}
}
