#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_PATH = './src/config/torq/master.key';

const targetPath = process.argv[2] || DEFAULT_PATH;

function ensureDirExists(filePath: string) {
	const dir = path.dirname(filePath);

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function generateKey(): string {
	return crypto.randomBytes(32).toString('base64');
}

function main() {
	console.log('\nTorq Master Key Generator\n');

	if (fs.existsSync(targetPath)) {
		console.error(`Key file already exists at: ${targetPath}`);
		console.error('Refusing to overwrite existing key.');
		process.exit(1);
	}

	ensureDirExists(targetPath);

	const key = generateKey();

	fs.writeFileSync(targetPath, key, {
		encoding: 'utf8',
		mode: 0o600,
	});

	console.log('Master key generated successfully.\n');

	console.log('Location:');
	console.log(targetPath);

	console.log(
		'\nPath to this file has been set default in app if changed make sure to change env config file:',
	);

	console.log(`\nTORQ_MASTER_KEY_FILE=${targetPath}\n`);

	console.log('Keep this file secure. If it is lost, encrypted secrets cannot be recovered.\n');
}

main();
