import { EMAIL_TEMPLATE_PATHS } from '@/application/constants/emailPaths';
import type { IEmailService } from '@/application/port/services/emailService.interface';
import type { OTPEmailType } from '@/application/port/usecases/email/emailSend.interface';
import type { IOTPEmailStrategy } from '@/application/port/usecases/email/otpEmailStrategy.interface';
import { TOKENS } from '@/config/di/tokens';
import { Envconfig } from '@/config/envconfig';
import { readFile } from 'node:fs/promises';
import { inject, injectable } from 'tsyringe';
@injectable()
export class EmailVerificationStrategy implements IOTPEmailStrategy {
	private appEmail: string;
	constructor(@inject(TOKENS.EmailService) private emailService: IEmailService) {
		this.appEmail = Envconfig.services.email.appEmail;
	}
	supports(type: OTPEmailType): boolean {
		return type === 'email-verification';
	}
	async send(input: { email: string; otp: string }): Promise<void> {
		const path = EMAIL_TEMPLATE_PATHS.EMAIL_VERIFICATION;

		let template: string;

		try {
			template = await readFile(path, 'utf-8');
		} catch {
			template = `<p>Your OTP for email verification is: <strong>${input.otp}</strong></p><p>This OTP is valid for 15 minutes.</p>`;
		}
		(await readFile(path, 'utf-8')) ||
			this.emailService.sendEmail({
				to: input.email,
				from: this.appEmail,
				subject: 'Your Email Verification OTP',
				html: template,
			});
	}
}
