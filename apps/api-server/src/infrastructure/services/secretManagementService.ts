import type { ISecretManagementService } from '@/application/port/services/secretManagementService.interface';
import { Envconfig } from '@/config/envconfig';
import fs from 'node:fs';
import crypto from 'node:crypto';
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
	encryptSecret = async (value: string) => {
		const iv = crypto.randomBytes(12);
		const cipher = crypto.createCipheriv(this.ALGO, this.masterKey, iv) as crypto.CipherGCM;
		const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
		const tag = cipher.getAuthTag();
		return {
			ciphertext: ciphertext.toString('base64'),
			iv: iv.toString('base64'),
			tag: tag.toString('base64'),
		};
	};

	decryptSecret = async (encrypted: { ciphertext: string; iv: string; tag: string }) => {
		const decipher = crypto.createDecipheriv(
			this.ALGO,
			this.masterKey,
			Buffer.from(encrypted.iv, 'base64'),
		) as crypto.DecipherGCM;
		decipher.setAuthTag(Buffer.from(encrypted.tag, 'base64'));
		const decrypted = Buffer.concat([
			decipher.update(Buffer.from(encrypted.ciphertext, 'base64')),
			decipher.final(),
		]);
		return decrypted.toString('utf8');
	};
}
