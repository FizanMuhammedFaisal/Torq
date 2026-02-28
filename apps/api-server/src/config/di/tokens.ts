export const TOKENS = {
	WorkflowController: Symbol.for('WorkflowController'),
	WorkflowRouter: Symbol.for('WorkflowRouter'),
	HealthRouter: Symbol.for('HealthRouter'),
	AuthRouter: Symbol.for('AuthRouter'),
	AppRouter: Symbol.for('AppRouter'),
	EmailService: Symbol.for('EmailService'),
	SignInOTPStrategy: Symbol.for('SignInOTPStrategy'),
	EmailVerificationStrategy: Symbol.for('EmailVerificationStrategy'),
	SendOTPEmail: Symbol.for('SendOTPEmail'),
} as const;
