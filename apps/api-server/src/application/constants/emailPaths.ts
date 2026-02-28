import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const EMAIL_TEMPLATE_PATHS = {
	SIGN_IN: join(__dirname, '../../infrastructure/services/mails/user-sign-in-otp-email.html'),
	EMAIL_VERIFICATION: join(
		__dirname,
		'../../infrastructure/services/mails/user-email-verification.html',
	),
};
