import { auth } from '@/infrastructure/auth/auth';
import Elysia, { type Context } from 'elysia';
import { injectable } from 'tsyringe';
import { jwtVerify, createRemoteJWKSet, createLocalJWKSet } from 'jose';
import { Envconfig } from '@/config/envconfig';
import { logger } from 'better-auth';

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;
export type AuthUser = NonNullable<Session>['user'];
export type AuthenticatedContext = Context & { user: AuthUser };

const jwksResult = await auth.api.getJwks();
const JWKS = createLocalJWKSet({ keys: jwksResult.keys });

// can later if needed only do jwt parsing avoiding db hit ? chek with docs
@injectable()
export class AuthMacro {
	plugin() {
		return new Elysia({ name: 'better-auth-jwt-macro' }).macro({
			auth: {
				async resolve({ status, request: { headers } }) {
					const authHeader = headers.get('authorization');
					const token = authHeader?.replace('Bearer ', '');

					if (!token) return status(401);
					try {
						const { payload } = await jwtVerify(token, JWKS, {
							issuer: Envconfig.services.betterAuth.baseURL,
							audience: Envconfig.services.betterAuth.baseURL,
						});
						return { user: payload };
					} catch (err) {
						if (err instanceof Error) {
							console.error("JWKS verify error:", err)
						}
						return status(401);
					}
				},
			},
		});
	}
}
