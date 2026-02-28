import pino, { type Logger as PinoLoggerInstance, type LoggerOptions } from 'pino';
import { injectable } from 'tsyringe';
import type { ILogger } from './ILogger.js';
import { hostname } from 'node:os';

export interface LoggerConfig {
	/** Node environment (e.g., 'development', 'production', 'test') */
	nodeEnv?: string;
	/** Log level (e.g., 'info', 'debug', 'warn', 'error') */
	logLevel?: string;
	/** Service name for log context */
	serviceName?: string;
	/** Hostname override */
	hostname?: string;
}

/**
 * Pino logger implementation with configurable options.
 *
 * @example
 * // Minimal - uses defaults
 * const logger = new Logger();
 *
 * @example
 * // With environment config from service
 * const logger = new Logger(undefined, {
 *   nodeEnv: process.env.NODE_ENV,
 *   logLevel: process.env.LOG_LEVEL,
 *   serviceName: process.env.SERVICE_NAME
 * });
 *
 * @example
 * // With custom Pino options
 * const logger = new Logger({
 *   level: 'debug',
 *   base: { service: 'my-service', version: '1.0.0' }
 * });
 */
@injectable()
export class Logger implements ILogger {
	private logger: PinoLoggerInstance;

	/**
	 * Creates a new Logger instance.
	 *
	 * @param options - logger options for advanced configuration
	 * @param config - Environment configuration passed from the service
	 */
	constructor({ options, config }: { options?: LoggerOptions; config?: LoggerConfig }) {
		const nodeEnv = config?.nodeEnv || 'development';
		const isDevelopment = nodeEnv === 'development';
		const isProduction = nodeEnv === 'production';

		const defaultOptions: LoggerOptions = {
			level: config?.logLevel || 'info',
			base: {
				pid: process.pid,
				hostname: config?.hostname || hostname(),
				service: config?.serviceName,
				environment: nodeEnv,
			},
			timestamp: pino.stdTimeFunctions.isoTime,

			// Error serialization for proper error logging
			serializers: {
				err: pino.stdSerializers.err,
				error: pino.stdSerializers.err,
				req: pino.stdSerializers.req,
				res: pino.stdSerializers.res,
			},

			// Redact sensitive information in production
			redact: {
				paths: [
					'password',
					'*.password',
					'token',
					'*.token',
					'accessToken',
					'*.accessToken',
					'refreshToken',
					'*.refreshToken',
					'secret',
					'*.secret',
					'authorization',
					'*.authorization',
					'cookie',
					'*.cookie',
					'apiKey',
					'*.apiKey',
				],
				remove: isProduction, // Remove in production, mask in development
			},

			// Pretty printing for development
			transport: isDevelopment
				? {
						target: 'pino-pretty',
						options: {
							colorize: true,
							translateTime: 'SYS:HH:MM:ss',
							ignore: 'pid,hostname',
							singleLine: true,
							messageFormat: '[{service}] {msg}',
						},
					}
				: undefined,
		};

		const mergedOptions: LoggerOptions = {
			...defaultOptions,
			...options,
			base: {
				...defaultOptions.base,
				...(options?.base || {}),
			},
			serializers: {
				...defaultOptions.serializers,
				...(options?.serializers || {}),
			},
			redact: options?.redact !== undefined ? options.redact : defaultOptions.redact,
		};

		this.logger = pino(mergedOptions);
	}

	info(labels: object | string, msg?: string, ...args: unknown[]): void {
		this.logger.info(labels, msg, ...args);
	}

	warn(labels: object | string, msg?: string, ...args: unknown[]): void {
		this.logger.warn(labels, msg, ...args);
	}

	error(labels: object | string, msg?: string, ...args: unknown[]): void {
		this.logger.error(labels, msg, ...args);
	}

	debug(labels: object | string, msg?: string, ...args: unknown[]): void {
		this.logger.debug(labels, msg, ...args);
	}

	fatal(labels: object | string, msg?: string, ...args: unknown[]): void {
		this.logger.fatal(labels, msg, ...args);
	}

	trace(labels: object | string, msg?: string, ...args: unknown[]): void {
		this.logger.trace(labels, msg, ...args);
	}
}
