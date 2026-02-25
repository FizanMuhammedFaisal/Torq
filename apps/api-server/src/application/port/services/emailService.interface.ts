export interface SendEmailOptions {
	to: string;
	from: string;
	subject: string;
	html: string;
}
export interface IEmailService {
	sendEmail: (options: SendEmailOptions) => Promise<{ ok: true } | { ok: false; error: unknown }>;
}
