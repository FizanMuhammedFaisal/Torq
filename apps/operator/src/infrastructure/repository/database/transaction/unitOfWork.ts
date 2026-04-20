import { injectable } from 'tsyringe';
import db from '../database.config';
import { transactionStorage } from './transactionContext';
import type { IUnitOfWork } from '@/application/port/repository/unitOfWork.interface';
/**
 * Uses {@link AsyncLocalStorage} to implicitly propagate the transaction
 * context through the async call chain. Repositories automatically detect
 * the active transaction via {@link getExecutor} without needing a `tx`
 * parameter in their method signatures.
 *
 * @see {@link IUnitOfWork} for the application-layer port interface.
 */
@injectable()
export class DrizzleUnitOfWork implements IUnitOfWork {
	/**
	 * Executes the provided callback within a database transaction.
	 *
	 * @param work - Async function containing repository operations to run atomically.
	 * @returns The value returned by the work callback.
	 * @throws Re-throws any error from the callback after rolling back the transaction.
	 */
	async execute<T>(work: () => Promise<T>): Promise<T> {
		return db.transaction(async (tx) => {
			return transactionStorage.run(tx, work);
		});
	}
}
