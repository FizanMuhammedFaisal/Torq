import { EMAIL_TEMPLATE_PATHS } from '@/application/constants/emailPaths';
import type { IEmailService } from '@/application/port/services/emailService.interface';
import type { OTPEmailType } from '@/application/port/usecases/email/emailSend.interface';
import type { IOTPEmailStrategy } from '@/application/port/usecases/email/otpEmailStrategy.interface';
import { TOKENS } from '@/config/di/tokens';
import { Envconfig } from '@/config/envconfig';
import { readFile } from 'node:fs/promises';
import { inject, injectable } from 'tsyringe';
@injectable()
export class SignInOTPStrategy implements IOTPEmailStrategy {
	private appEmail: string;
	constructor(@inject(TOKENS.EmailService) private emailService: IEmailService) {
		this.appEmail = Envconfig.services.email.appEmail;
	}
	supports(type: OTPEmailType): boolean {
		return type === 'sign-in';
	}
	async send(input: { email: string; otp: string }): Promise<void> {
		const path = EMAIL_TEMPLATE_PATHS.SIGN_IN;
		let template: string;

		try {
			template = await readFile(path, 'utf-8');
		} catch {
			template = `<p>Your OTP for signing in is: <strong>${input.otp}</strong></p><p>This OTP is valid for 15 minutes.</p>`;
		}
		this.emailService.sendEmail({
			to: input.email,
			from: this.appEmail,
			subject: 'Your Sign-In OTP',
			html: template,
		});
	}
}
