import { Envconfig } from '@/config/envconfig';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(Envconfig.database.url);

export default db;
