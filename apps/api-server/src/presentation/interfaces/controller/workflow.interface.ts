import type { Context } from 'elysia';

export interface IWorkflowController {
	getWorkflows: (ctx: Context) => Promise<{ message: string }>;
}
