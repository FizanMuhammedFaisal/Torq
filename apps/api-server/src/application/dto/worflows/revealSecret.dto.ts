export interface RevealSecretInputDto {
	workflowId: string;
	key: string;
	req: { id: string };
}

export interface RevealSecretOutputDto {
	key: string;
	value: string;
}
