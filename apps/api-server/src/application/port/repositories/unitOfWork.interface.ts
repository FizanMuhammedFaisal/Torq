/**
 * Unit of Work port interface.
 *
 * Defines the contract for executing multiple repository operations
 * within a single atomic database transaction. If any operation inside
 * the callback throws, the entire transaction is rolled back automatically.
 *
 * @example
 * ```typescript
 * const result = await this.unitOfWork.execute(async () => {
 *   const saved = await this.workflowRepo.save(workflow);
 *   await this.versionRepo.save(version);
 *   return saved;
 * });
 * // Both saves succeed together, or neither does.
 * ```
 */
export interface IUnitOfWork {
	execute<T>(work: () => Promise<T>): Promise<T>;
}


