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
			const response = await resend.emails.send({
				to: options.to,
				from: options.from,
				subject: options.subject,
				html: options.html,
			});

			if (response.error) {
				logger.error({
					resendError: response.error,
				});

				return {
					ok: false,
					error: response.error,
				};
			}

			logger.info({
				resendEmailSendID: response.data?.id,
				EmailHeaders: response.headers,
			});

			return {
				ok: true,
			};
		} catch (error) {
			logger.error({
				error: error,
				message: 'Failed to send email using ResendEmailService',
			});
			return {
				ok: false,
				error,
			};
		}
	}
}
