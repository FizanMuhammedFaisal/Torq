import 'reflect-metadata';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer, openAPI } from 'better-auth/plugins';
import db from '@/infrastructure/repository/database/database.config';
import { Envconfig } from '@/config/envconfig';
import * as schema from '@/infrastructure/repository/database/schema/auth.schema';
import { jwt } from 'better-auth/plugins';
import { emailOTP } from 'better-auth/plugins';
import { container } from '@/config/di/container';
import type { ISendOTPEmail } from '@/application/port/usecases/email/emailSend.interface';
import { TOKENS } from '@/config/di/tokens';

export const auth = betterAuth({
	basePath: '/auth/api',
	baseURL: Envconfig.services.betterAuth.baseURL,
	trustedOrigins: Envconfig.app.cors.origins,
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: schema,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		autoSignIn: true,

	},

	plugins: [
		bearer(),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				const sendOTP = container.resolve<ISendOTPEmail>(TOKENS.SendOTPEmail);
				sendOTP.execute(email, otp, type);
			},
			expiresIn: 15 * 60,
			allowedAttempts: 3,
			overrideDefaultEmailVerification: true,
		}),
		openAPI(),
		jwt({
			jwt: {
				expirationTime: '15m',
				definePayload: ({ user }) => ({
					id: user.id,
					email: user.email,
				}),
			},
		}),
	],
	session: {
		expiresIn: 60 * 60 * 24 * 30, // 30 days , "refresh token" lives
		updateAge: 60 * 60 * 24,
		cookieCache: {
			enabled: false,
			maxAge: 5 * 60, // Cache duration in seconds
		},

	},
	advanced: {
		useSecureCookies: false,
	},

	socialProviders: {
		google: {
			clientId: Envconfig.services.googleAuth.clientId,
			clientSecret: Envconfig.services.googleAuth.clientSecret,
		},
		github: {
			clientId: Envconfig.services.githubAuth.clientId,
			clientSecret: Envconfig.services.githubAuth.clientSecret,
		},
	},
});
