export class Workflow {
	private constructor(
		public readonly id: string,
		public readonly identityId: string,
		public name: string,
		public readonly createdAt: Date,
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
	update(name?: string, description?: string) {
		if (name) {
			this.name = name;
		}
		if (description) {
			this.description = description;
		}
	}
}
