import { auth } from '@/infrastructure/auth/auth';
import Elysia, { type Context } from 'elysia';
import { injectable } from 'tsyringe';

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;
export type AuthUser = NonNullable<Session>['user'];
export type AuthenticatedContext = Context & { user: AuthUser };

// can later if needed only do jwt parsing avoiding db hit ? chek with docs
@injectable()
export class AuthMacro {
	plugin() {
		return new Elysia({ name: 'better-auth-jwt-macro' }).macro({
			auth: {
				async resolve({ status, request: { headers } }) {
					const session = await auth.api.getSession({ headers });
					if (!session) return status(401);
					return {
						user: session.user,
						session: session.session,
					};
				},
			},
		});
	}
}
