import { Elysia } from 'elysia';
import { injectable } from 'tsyringe';
import type { Router } from '@/presentation/http/interfaces/routes';

@injectable()
export class HealthRouter implements Router {
	readonly prefix = '' as const;

	register() {
		return new Elysia({ prefix: this.prefix })
			.get('/health', () => ({
				status: 'ok',
				timestamp: new Date().toISOString(),
			}))
			.get('/', () => ({
				message: 'Torq API',
				endpoints: ['/health', '/workflows'],
			}));
	}
}
