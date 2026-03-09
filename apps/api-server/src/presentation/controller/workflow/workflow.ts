import type { Context } from 'elysia';
import { injectable } from 'tsyringe';
import type { IWorkflowController } from '@/presentation/interfaces/controller/workflow.interface';
import type { AuthenticatedContext } from '@/presentation/macros/auth.macro';

@injectable()
export class WorkflowController implements IWorkflowController {
	getWorkflows = async (ctx: Context) => {
		return new Promise<{ message: string }>((resolve) => {
			resolve({
				message: 'Workflow',
			});
		});
	};
	createWorkflow = async (ctx: AuthenticatedContext) => {
		return new Promise<{ message: string }>((resolve) => {
			resolve({
				message: 'Workflow created',
			});
		});
	};
	createSecret = async (ctx: Context) => {
		return new Promise<{ message: string }>((resolve) => {
			resolve({
				message: 'Secret created',
			});
		});
	};
	getSecrets = async (ctx: Context) => {
		return new Promise<{ message: string }>((resolve) => {
			resolve({
				message: 'Secrets',
			});
		});
	};
}
