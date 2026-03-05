import type { ISecretManagementService } from '@/application/port/services/secretManagementService.interface';
import { Envconfig } from '@/config/envconfig';
import fs from 'node:fs';
export class SecretManagementService implements ISecretManagementService {
	private ALGO = 'aes-256-gcm';
	private masterKey: Buffer;
	private loadMasterKey() {
		const keyPath = Envconfig.app.masterKeyFile;
		if (!keyPath) {
			throw new Error('TORQ_MASTER_KEY_FILE not set');
		}
		const key = fs.readFileSync(keyPath, 'utf8').trim();

		if (!key) {
			console.error('TORQ_MASTER_KEY is not set');
			console.error('Read Storing Secrects in the documentation for more details');
			process.exit(1);
		}
		let decoded: Buffer;
		try {
			decoded = Buffer.from(key, 'base64');
		} catch {
			console.error('TORQ_MASTER_KEY must be valid base64');
			process.exit(1);
		}

		if (decoded.length !== 32) {
			console.error(`TORQ_MASTER_KEY must be 32 bytes (256 bits). Got ${decoded.length} bytes`);
			process.exit(1);
		}
		return decoded;
	}
	constructor() {
		this.masterKey = this.loadMasterKey();
	}
	encryptSecret = async (value: string) => {};

	decryptSecret = async (encrypted: { ciphertext: string; iv: string; tag: string }) => {
		// Implementation for decrypting secret
	};
}
