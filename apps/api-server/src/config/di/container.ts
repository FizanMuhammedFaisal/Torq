import { container, Lifecycle } from 'tsyringe';
import { WorkflowController } from '@/presentation/controller/workflow/workflow';
import { AppRouter } from '@/presentation/routes';
import { AuthRouter } from '@/presentation/routes/auth/auth';
import { HealthRouter } from '@/presentation/routes/health/health';
import { WorkflowRouter } from '@/presentation/routes/workflow/workflow';
import { TOKENS } from './tokens';
import { ResendEmailService } from '@/infrastructure/services/emailService';
import { SignInOTPStrategy } from '@/application/usecases/email/strategies/signInOTPStrategy';
import { EmailVerificationStrategy } from '@/application/usecases/email/strategies/emailVerificationStrategy';
import { ForgetPasswordStrategy } from '@/application/usecases/email/strategies/forgetPasswordStrategy';
import { SendOTPUseCase } from '@/application/usecases/email/sendOTP.usecase';

import { WorkflowRepository } from '@/infrastructure/repository/workflow.repository';
import { SecrectRepository } from '@/infrastructure/repository/secret.repository';
import { WorkflowVersionRepository } from '@/infrastructure/repository/workflowVersion.repository';
import { WorkflowMapper } from '@/infrastructure/repository/mappers/workflow.mapper';
import { SecretMapper } from '@/infrastructure/repository/mappers/secret.mapper';
import { WorkflowVersionMapper } from '@/infrastructure/repository/mappers/workflowVersion.mapper';

// Register as singletons using Symbols
container.register(
	TOKENS.WorkflowController,
	{ useClass: WorkflowController },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(
	TOKENS.WorkflowRouter,
	{ useClass: WorkflowRouter },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(
	TOKENS.HealthRouter,
	{ useClass: HealthRouter },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(TOKENS.AuthRouter, { useClass: AuthRouter }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.AppRouter, { useClass: AppRouter }, { lifecycle: Lifecycle.Singleton });
container.register(
	TOKENS.EmailService,
	{ useClass: ResendEmailService },
	{ lifecycle: Lifecycle.Singleton },
);

container.register(
	TOKENS.SignInOTPStrategy,
	{ useClass: SignInOTPStrategy },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(
	TOKENS.EmailVerificationStrategy,
	{ useClass: EmailVerificationStrategy },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(
	TOKENS.ForgetPasswordStrategy,
	{ useClass: ForgetPasswordStrategy },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(
	TOKENS.SendOTPEmail,
	{ useClass: SendOTPUseCase },
	{ lifecycle: Lifecycle.Singleton },
);

// Repository & Mapper Registration
container.register(
	TOKENS.WorkflowRepository,
	{ useClass: WorkflowRepository },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(
	TOKENS.SecretRepository,
	{ useClass: SecrectRepository },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(
	TOKENS.WorkflowVersionRepository,
	{ useClass: WorkflowVersionRepository },
	{ lifecycle: Lifecycle.Singleton },
);
container.register(TOKENS.WorkflowMapper, { useClass: WorkflowMapper });
container.register(TOKENS.SecretMapper, { useClass: SecretMapper });
container.register(TOKENS.WorkflowVersionMapper, { useClass: WorkflowVersionMapper });

export { container };
