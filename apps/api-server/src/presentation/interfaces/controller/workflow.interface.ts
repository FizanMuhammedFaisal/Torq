import type { AuthenticatedContext } from '@/presentation/macros/auth.macro';
import type { Context } from 'elysia';

export interface IWorkflowController {
	getWorkflows: (ctx: Context) => Promise<{ message: string }>;
	createWorkflow: (ctx: AuthenticatedContext) => Promise<{ message: string }>;
	createSecret: (ctx: Context) => Promise<{ message: string }>;
	getSecrets: (ctx: Context) => Promise<{ message: string }>;
}
