export class Workflow {
	private constructor(
		public id: string,
		public identityId: string,
		public name: string,
		public description: string,
		public createdAt: Date,
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
		description: string;
		createdAt: Date;
	}) {
		return new Workflow(id, identityId, name, description, createdAt);
	}
}
