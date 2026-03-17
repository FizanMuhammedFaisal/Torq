import { Envconfig } from '@/config/envconfig';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './src/infrastructure/repository/database/migrations',
	schema: './src/infrastructure/repository/database/schema/*',
	dialect: 'postgresql',
	dbCredentials: {
		url: Envconfig.database.url,
	},
	verbose: true,
	strict: true,
});
