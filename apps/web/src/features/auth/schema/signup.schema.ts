import { z } from 'zod/v4';

export const signupEmailSchema = z.object({
	name: z.string().min(1, 'Full name is required'),
	email: z.email('Please enter a valid email address'),
});

export const signupOtpSchema = z.object({
	otp: z
		.string()
		.length(6, 'OTP must be 6 digits')
		.regex(/^\d{6}$/, 'OTP must contain only digits'),
});

export type SignupEmailInput = z.infer<typeof signupEmailSchema>;
export type SignupOtpInput = z.infer<typeof signupOtpSchema>;
