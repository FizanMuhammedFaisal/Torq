/**
 * Transaction context using AsyncLocalStorage.
 *
 * Provides implicit transaction propagation across async call chains.
 * This eliminates the need to pass a `tx` parameter through every
 * repository method, keeping the {@link IBaseRepository} interface clean.
 *
 * @module transactionContext
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import db from '../database.config';

/**
 * The Drizzle transaction client type, inferred from `db.transaction()`.
 */
type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Stores the active transaction client for the current async context.
 * Only the {@link DrizzleUnitOfWork} should write to this storage.
 */
const transactionStorage = new AsyncLocalStorage<TransactionClient>();

/**
 * Returns the database executor for the current context.
 *
 * - Inside a `unitOfWork.execute()` block → returns the active transaction client.
 * - Outside a transaction → returns the default `db` instance.
 *
 * Repositories should call this instead of importing `db` directly.
 *
 * @returns The active transaction client or default database connection.
 */
export function getExecutor(): TransactionClient | NodePgDatabase<typeof import('../schema')> {
	return transactionStorage.getStore() ?? db;
}

export { transactionStorage };
