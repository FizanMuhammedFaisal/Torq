export type OTPEmailType = 'sign-in' | 'email-verification' | 'forget-password';
export interface ISendOTPEmail {
	execute: (email: string, otp: string, type: OTPEmailType) => Promise<void>;
}
