// this file is a part of elysia docs for openapi spec
// https://elysiajs.com/integrations/better-auth
import { auth } from '@/infrastructure/auth/auth';

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
// biome-ignore lint/suspicious/noAssignInExpressions: <this is from docs>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
	getPaths: (prefix = '/auth/api') =>
		getSchema().then(({ paths }) => {
			const reference: typeof paths = Object.create(null);

			for (const path of Object.keys(paths)) {
				const key = prefix + path;
				reference[key] = paths[path];

				for (const method of Object.keys(paths[path])) {
					// biome-ignore lint/suspicious/noExplicitAny: <from docs>
					const operation = (reference[key] as any)[method];

					operation.tags = ['Better Auth'];
				}
			}

			return reference;
			// biome-ignore lint/suspicious/noExplicitAny: <from docs>
		}) as Promise<any>,
	components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
