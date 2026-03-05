import type { Context } from 'elysia';

export interface IWorkflowController {
	getWorkflows: (ctx: Context) => Promise<{ message: string }>;
	createWorkflow: (ctx: Context) => Promise<{ message: string }>;
	createSecret: (ctx: Context) => Promise<{ message: string }>;
	getSecrets: (ctx: Context) => Promise<{ message: string }>;
}
