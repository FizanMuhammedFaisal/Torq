import 'reflect-metadata';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
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
	trustedOrigins: Envconfig.app.cors.origins,
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				const sendOTP = container.resolve<ISendOTPEmail>(TOKENS.SendOTPEmail);
				sendOTP.execute(email, otp, type);
			},
			expiresIn: 15 * 60,
			allowedAttempts: 3,
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
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	socialProviders: {
		google: {
			clientId: Envconfig.services.googleAuth.clientId,
			clientSecret: Envconfig.services.googleAuth.clientSecret,
		},
	},
});
