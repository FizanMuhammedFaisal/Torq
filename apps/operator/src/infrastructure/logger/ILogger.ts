/**
 * Logger interface for structured logging.
 */
export interface ILogger {
	/**
	 * Log informational messages
	 *
	 * @param labels - Context object that can include:
	 *   - `label`: string | string[] - Categorization labels (e.g., class name, method name, operation type)
	 *   - Any other contextual data (userId, requestId, etc.)
	 * @param msg - Human-readable log message (supports string interpolation with args)
	 * @param args - Values for string interpolation in the message (e.g., logger.info({}, 'User %s logged in', userId))
	 *
	 * @example
	 * logger.info({ label: 'UserService' }, 'User created');
	 * logger.info({ label: ['UserService', 'createUser'] }, 'Creating user');
	 * logger.info({ userId: '123', label: 'UserService.createUser' }, 'User created successfully');
	 * logger.info({ label: 'UserService' }, 'User %s created with email %s', userId, email);
	 */
	info(labels: object | string, msg?: string, ...args: unknown[]): void;

	/**
	 * Log warning messages
	 *
	 * @param labels - Context object that can include:
	 *   - `label`: string | string[] - Categorization labels (e.g., class name, method name, operation type)
	 *   - Any other contextual data (userId, requestId, etc.)
	 * @param msg - Human-readable log message (supports string interpolation with args)
	 * @param args - Values for string interpolation in the message
	 *
	 * @example
	 * logger.warn({ label: 'RateLimiter' }, 'Rate limit approaching');
	 * logger.warn({ userId: '123', label: ['AuthService', 'login'] }, 'Multiple failed attempts');
	 * logger.warn({ label: 'RateLimiter' }, 'User %s exceeded %d requests', userId, maxRequests);
	 */
	warn(labels: object | string, msg?: string, ...args: unknown[]): void;

	/**
	 * Log error messages
	 *
	 * @param labels - Context object that can include:
	 *   - `label`: string | string[] - Categorization labels (e.g., class name, method name, operation type)
	 *   - `err`: Error - The error object for proper serialization
	 *   - Any other contextual data (userId, requestId, etc.)
	 * @param msg - Human-readable log message (supports string interpolation with args)
	 * @param args - Values for string interpolation in the message
	 *
	 * @example
	 * logger.error({ err, label: 'DatabaseService' }, 'Connection failed');
	 * logger.error({ err, userId: '123', label: ['UserRepository', 'findById'] }, 'Query failed');
	 * logger.error({ err, label: 'DatabaseService' }, 'Failed to connect to %s on port %d', host, port);
	 */
	error(labels: object | string, msg?: string, ...args: unknown[]): void;

	/**
	 * Log debug messages
	 *
	 * @param labels - Context object that can include:
	 *   - `label`: string | string[] - Categorization labels (e.g., class name, method name, operation type)
	 *   - Any other contextual data (userId, requestId, etc.)
	 * @param msg - Human-readable log message (supports string interpolation with args)
	 * @param args - Values for string interpolation in the message
	 *
	 * @example
	 * logger.debug({ label: 'CacheService' }, 'Cache hit');
	 * logger.debug({ cacheKey: 'user:123', label: ['CacheService', 'get'] }, 'Retrieved from cache');
	 * logger.debug({ label: 'CacheService' }, 'Cache hit for key %s in %dms', cacheKey, duration);
	 */
	debug(labels: object | string, msg?: string, ...args: unknown[]): void;

	/**
	 * Log fatal messages (highest severity)
	 *
	 * @param labels - Context object that can include:
	 *   - `label`: string | string[] - Categorization labels (e.g., class name, method name, operation type)
	 *   - `err`: Error - The error object for proper serialization
	 *   - Any other contextual data (userId, requestId, etc.)
	 * @param msg - Human-readable log message (supports string interpolation with args)
	 * @param args - Values for string interpolation in the message
	 *
	 * @example
	 * logger.fatal({ err, label: 'Application' }, 'Critical system failure');
	 * logger.fatal({ err, label: 'Application' }, 'System crashed after %d retries', retryCount);
	 */
	fatal(labels: object | string, msg?: string, ...args: unknown[]): void;

	/**
	 * Log trace messages (lowest severity)
	 *
	 * @param labels - Context object that can include:
	 *   - `label`: string | string[] - Categorization labels (e.g., class name, method name, operation type)
	 *   - Any other contextual data (userId, requestId, etc.)
	 * @param msg - Human-readable log message (supports string interpolation with args)
	 * @param args - Values for string interpolation in the message
	 *
	 * @example
	 * logger.trace({ label: ['UserService', 'createUser', 'validation'] }, 'Validating input');
	 * logger.trace({ label: 'UserService' }, 'Step %d: %s', stepNumber, stepName);
	 */
	trace(labels: object | string, msg?: string, ...args: unknown[]): void;
}
