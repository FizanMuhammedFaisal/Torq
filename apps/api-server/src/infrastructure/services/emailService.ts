import type {
	EmailService,
	SendEmailOptions,
} from '@/application/port/services/emailService.interface';
import { Envconfig } from '@/config/envconfig';
import { Resend } from 'resend';
import { logger } from '../logger/logger';

const resend = new Resend(Envconfig.services.email.resendKey);
export class ResendEmailService implements EmailService {
	async sendEmail(
		options: SendEmailOptions,
	): Promise<{ ok: true } | { ok: false; error: unknown }> {
		try {
			const sendEmail = await resend.emails.send({
				to: options.to,
				from: options.from,
				subject: options.subject,
				html: options.html,
			});
			logger.info({
				resendEmailSendID: sendEmail.data?.id,
				EmailHeaders: sendEmail.headers,
			});
			return {
				ok: true,
			};
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}
}
