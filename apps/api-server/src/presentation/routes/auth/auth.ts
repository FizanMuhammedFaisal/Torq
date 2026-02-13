import Elysia from 'elysia';
import { injectable } from 'tsyringe';
import { auth } from '@/infrastructure/auth/auth';
import type { Router } from '@/presentation/interfaces/routes';

@injectable()
export class AuthRouter implements Router {
	prefix = '/auth';
	register() {
		return new Elysia().mount('/auth', auth.handler);
	}
}
