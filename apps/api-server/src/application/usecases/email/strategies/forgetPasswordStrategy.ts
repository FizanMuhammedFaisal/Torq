import { EMAIL_TEMPLATE_PATHS } from '@/application/constants/emailPaths';
import type { IEmailService } from '@/application/port/services/emailService.interface';
import type { OTPEmailType } from '@/application/port/usecases/email/emailSend.interface';
import type { IOTPEmailStrategy } from '@/application/port/usecases/email/otpEmailStrategy.interface';
import { TOKENS } from '@/config/di/tokens';
import { Envconfig } from '@/config/envconfig';
import { readFile } from 'node:fs/promises';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ForgetPasswordStrategy implements IOTPEmailStrategy {
	private appEmail: string;

	constructor(@inject(TOKENS.EmailService) private emailService: IEmailService) {
		this.appEmail = Envconfig.services.email.appEmail;
	}

	supports(type: OTPEmailType): boolean {
		return type === 'forget-password';
	}

	async send(input: { email: string; otp: string }): Promise<void> {
		const path = EMAIL_TEMPLATE_PATHS.FORGET_PASSWORD || ''; // Fallback if not configured
		let template: string;

		try {
			if (!path) throw new Error('No path');
			template = await readFile(path, 'utf-8');
		} catch {
			template = `<p>You requested a password reset.</p><p>Your password reset OTP is: <strong>${input.otp}</strong></p><p>This OTP is valid for 15 minutes.</p>`;
		}

		this.emailService.sendEmail({
			to: input.email,
			from: this.appEmail,
			subject: 'Password Reset OTP',
			html: template,
		});
	}
}
