import { container, Lifecycle } from 'tsyringe';
import { WorkflowController } from '@/presentation/controller/workflow/workflow';
import { AppRouter } from '@/presentation/routes';
import { AuthRouter } from '@/presentation/routes/auth/auth';
import { HealthRouter } from '@/presentation/routes/health/health';
import { WorkflowRouter } from '@/presentation/routes/workflow/workflow';
import { TOKENS } from './tokens';

// Register as singletons using Symbols
container.register(TOKENS.WorkflowController, { useClass: WorkflowController }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.WorkflowRouter, { useClass: WorkflowRouter }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.HealthRouter, { useClass: HealthRouter }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.AuthRouter, { useClass: AuthRouter }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.AppRouter, { useClass: AppRouter }, { lifecycle: Lifecycle.Singleton });

export { container };
