import type { OTPEmailType } from './emailSend.interface';

export type IOTPEmailStrategy = {
	supports: (type: OTPEmailType) => boolean;
	send: (input: { email: string; otp: string }) => Promise<void>;
};
