export class Secret {
	private constructor(
		public readonly id: string,
		public workflowId: string,
		public key: string,
		public ciphertext: string,
		public iv: string,
		public tag: string,
		public createdAt: Date,
		public updatedAt: Date,
	) {}
	static create({
		id,
		workflowId,
		key,
		ciphertext,
		iv,
		tag,
		createdAt,
		updatedAt,
	}: {
		id: string;
		workflowId: string;
		key: string;
		ciphertext: string;
		iv: string;
		tag: string;
		createdAt: Date;
		updatedAt: Date;
	}) {
		return new Secret(id, workflowId, key, ciphertext, iv, tag, createdAt, updatedAt);
	}
	rehydrate({
		id,
		workflowId,
		key,
		ciphertext,
		iv,
		tag,
		createdAt,
	}: {
		id: string;
		workflowId: string;
		key: string;
		ciphertext: string;
		iv: string;
		tag: string;
		createdAt: Date;
	}) {
		return new Secret(id, workflowId, key, ciphertext, iv, tag, createdAt, new Date());
	}
}
