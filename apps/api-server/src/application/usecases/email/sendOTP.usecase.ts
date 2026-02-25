import type {
	ISendOTPEmail,
	OTPEmailType,
} from '@/application/port/usecases/email/emailSend.interface';
import type { IOTPEmailStrategy } from '@/application/port/usecases/email/otpEmailStrategy.interface';
import { TOKENS } from '@/config/di/tokens';
import { inject } from 'tsyringe';

export class SendOTPUseCase implements ISendOTPEmail {
	private strategies: Record<Exclude<OTPEmailType, 'forget-password'>, IOTPEmailStrategy>;
	constructor(
		@inject(TOKENS.SignInOTPStrategy) signInOTPStrategy: IOTPEmailStrategy,
		@inject(TOKENS.EmailVerificationStrategy) emailVerificationStrategy: IOTPEmailStrategy,
	) {
		this.strategies = {
			'sign-in': signInOTPStrategy,
			'email-verification': emailVerificationStrategy,
		};
	}
	async execute(email: string, otp: string, type: OTPEmailType): Promise<void> {
		if (type === 'forget-password') {
			throw new Error('Not supported here');
		}
		const strategy = this.strategies[type];

		if (!strategy) {
			throw new Error(`No strategy found for type: ${type}`);
		}

		await strategy.send({ email, otp });
	}
}
