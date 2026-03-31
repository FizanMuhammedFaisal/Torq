import { AsyncLocalStorage } from 'node:async_hooks';
import db from '../database.config';
// https://github.com/drizzle-team/drizzle-orm/issues/543
/**
 * Transaction context using AsyncLocalStorage.
 *
 * Provides implicit transaction propagation across async call chains.
 * This eliminates the need to pass a `tx` parameter through every
 * repository method, keeping the {@link IBaseRepository} interface clean.
 *
 * @module transactionContext
 */

type DB = typeof db;
type TransactionClient = Parameters<Parameters<DB['transaction']>[0]>[0];
// type AfterCommitCallback = () => Promise<unknown>;
// type TransactionState = {
// 	transaction: TransactionClient,
// 	afterCommit: AfterCommitCallback[],

// }

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
export function getExecutor():
	| TransactionClient
	| DB {
	return transactionStorage.getStore() ?? db;
}

export { transactionStorage };
