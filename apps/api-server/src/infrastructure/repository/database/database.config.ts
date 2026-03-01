import { Envconfig } from '@/config/envconfig';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
	connectionString: Envconfig.database.url,
});

let isConnected = false;
let retryCount = 0;
let retryDelay = 2000; // Initial retry delay in milliseconds
async function checkDatabaseConnection() {
	try {
		if (isConnected) {
			console.log('Database is already connected');
			return;
		}
		const client = await pool.connect();
		await client.query('SELECT 1');
		client.release();
		console.log('Database connected successfully');
		isConnected = true;
	} catch (error) {
		console.error('Database connection failed');
		console.error(error);
		if (retryCount < 5) {
			console.log(`Retrying database connection in ${retryDelay}ms...`);
			setTimeout(() => {
				checkDatabaseConnection();
				retryCount++;
				retryDelay = Math.min(10000, retryDelay * 2); // Exponential backoff
			}, retryDelay);
		} else {
			console.error('Max retry attempts reached. Exiting application.');
			process.exit(1); // Crash app intentionally
		}
	}
}

await checkDatabaseConnection();

const db = drizzle(pool);

export default db;
