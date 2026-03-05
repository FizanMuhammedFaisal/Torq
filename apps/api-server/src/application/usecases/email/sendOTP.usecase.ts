import type {
	ISendOTPEmail,
	OTPEmailType,
} from '@/application/port/usecases/email/emailSend.interface';
import type { IOTPEmailStrategy } from '@/application/port/usecases/email/otpEmailStrategy.interface';
import { TOKENS } from '@/config/di/tokens';
import { inject, injectable } from 'tsyringe';
@injectable()
export class SendOTPUseCase implements ISendOTPEmail {
	private strategies: Record<OTPEmailType, IOTPEmailStrategy>;
	constructor(
		@inject(TOKENS.SignInOTPStrategy) signInOTPStrategy: IOTPEmailStrategy,
		@inject(TOKENS.EmailVerificationStrategy) emailVerificationStrategy: IOTPEmailStrategy,
		@inject(TOKENS.ForgetPasswordStrategy) forgetPasswordStrategy: IOTPEmailStrategy,
	) {
		this.strategies = {
			'sign-in': signInOTPStrategy,
			'email-verification': emailVerificationStrategy,
			'forget-password': forgetPasswordStrategy,
			'change-email': emailVerificationStrategy,
		};
	}
	async execute(email: string, otp: string, type: OTPEmailType): Promise<void> {
		const strategy = this.strategies[type];

		if (!strategy) {
			throw new Error(`No strategy found for type: ${type}`);
		}

		await strategy.send({ email, otp });
	}
}
