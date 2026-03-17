export type ISecretManagementService = {
	encryptSecret: (value: string) => Promise<EncryptedSecret>;
	decryptSecret: (encrypted: EncryptedSecret) => Promise<string>;
};

type EncryptedSecret = {
	ciphertext: string;
	iv: string;
	tag: string;
};
