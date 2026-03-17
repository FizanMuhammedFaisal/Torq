# Logging Library

A production-ready, configurable logging library built on top of [Pino](https://getpino.io/), designed to be used across multiple services in the Togather infrastructure.

### Structured Logging
- **Base Context Fields**: Every log includes service name, environment, hostname, and process ID
- **Child Loggers**: Create contextual loggers with additional bindings (e.g., requestId, userId)
- **Error Serialization**: Proper error stack trace serialization using Pino's standard serializers

### Environment-Aware
- **Development Mode**: Pretty-printed, colorized logs for easy debugging
- **Production Mode**: JSON-formatted logs optimized for log aggregation systems
- **Configurable Log Levels**: Set via `LOG_LEVEL` environment variable

### Fully Configurable
- **Constructor Options**: Pass any Pino `LoggerOptions` to customize behavior
- **Smart Defaults**: Works out-of-the-box with sensible production-grade defaults
- **Backward Compatible**: Existing code continues to work without any changes


## Usage

### Basic Usage

```typescript
import { Logger } from '@togatherlabs/shared-utils/logger';

// Minimal - uses defaults
const logger = new Logger();

// With environment config from service (recommended)
const logger = new Logger(undefined, {
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL,
  serviceName: process.env.SERVICE_NAME
});

// Simple logging
logger.info({ label: 'app' }, 'Application started');
logger.warn({ label: 'RateLimiter' }, 'Rate limit approaching');
logger.error({ err, label: 'DatabaseService' }, 'Connection failed');
logger.debug({ label: 'CacheService' }, 'Cache hit for key: user:123');
```

### Structured Logging

```typescript
// Log with additional context
logger.info({ userId: '123', action: 'login', label: 'auth' }, 'User logged in');

// Log errors with proper serialization
try {
  await someOperation();
} catch (err) {
  logger.error({ err, label: 'DatabaseService' }, 'Operation failed');
}
```

### Labels (Categorization & Filtering)

Labels allow you to categorize logs for easier filtering in production monitoring systems. Use labels to identify the type of operation, method name, or component.

```typescript
// Single label - just add it to the context object
logger.info({ userId: '123', label: 'auth' }, 'User logged in');
logger.error({ err, label: 'database' }, 'Database connection failed');

// Multiple labels (array) for hierarchical categorization
logger.info(
  { method: 'POST', endpoint: '/api/users', label: ['api', 'user-service', 'create-user'] }, 
  'API request'
);

// RPC method logging
logger.info(
  { method: 'CreateUser', data, label: ['rpc', 'grpc', 'CreateUser'] }, 
  'RPC call: CreateUser'
);
```

**Use Cases for Labels:**
- **API Endpoints**: `label: ['api', 'http', 'post']`
- **RPC Methods**: `label: ['rpc', 'grpc', 'CreateUser']`
- **Database Operations**: `label: ['database', 'query', 'users']`
- **Cache Operations**: `label: ['cache', 'redis', 'get']`
- **Authentication**: `label: ['auth', 'login']`
- **Validation**: `label: ['validation', 'input']`

**Filtering in Production:**
```bash
# Filter logs by label in CloudWatch/Datadog/etc
label = "database"
label[0] = "rpc" AND label[2] = "CreateUser"
```

### Custom Configuration

```typescript
import { Logger } from '@togatherlabs/shared-utils/logger';

// Pass environment config from your service
const logger = new Logger(undefined, {
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL,
  serviceName: process.env.SERVICE_NAME,
  hostname: process.env.HOSTNAME
});

// Or with advanced Pino options
const customLogger = new Logger({
  level: 'debug',
  base: {
    service: 'my-custom-service',
    version: '2.0.0',
    region: 'us-east-1',
  },
  // Override redaction settings
  redact: {
    paths: ['password', 'ssn', 'creditCard'],
    remove: true, // Remove instead of masking
  },
});

customLogger.info({ label: 'app' }, 'Custom logger initialized');
```

### Dependency Injection

```typescript
import { inject, injectable } from 'inversify';
import { TYPES } from '@config/di/types';
import type { ILogger } from '@togatherlabs/shared-utils/logger';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger
  ) {}

  async createUser(data: CreateUserDTO) {
    this.logger.info({ userId: data.id, label: 'UserService' }, 'Creating user');
    // ... implementation
  }
}
```

## Configuration

### LoggerConfig Interface

**Services pass their environment variables via the `config` parameter:**

```typescript
import { Logger, type LoggerConfig } from '@togatherlabs/shared-utils/logger';

const config: LoggerConfig = {
  nodeEnv: process.env.NODE_ENV,        // 'development' | 'production' | 'test'
  logLevel: process.env.LOG_LEVEL,      // 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  serviceName: process.env.SERVICE_NAME, // Your service name
  hostname: process.env.HOSTNAME         // Optional: override hostname
};

const logger = new Logger(undefined, config);
```

**LoggerConfig Fields:**

| Field | Description | Default | Required |
|-------|-------------|---------|----------|
| `nodeEnv` | Environment (`development`, `production`, `test`) | `'development'` | No |
| `logLevel` | Log level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`) | `'info'` | No |
| `serviceName` | Service name for log context | `undefined` | No |
| `hostname` | Hostname override | OS hostname | No |

**Environment-based behavior:**
- `nodeEnv: 'development'` → Pretty colored logs, sensitive data masked
- `nodeEnv: 'production'` → JSON logs, sensitive data removed completely

**Typical service setup:**
```typescript
// In your service's logger initialization
import { Logger } from '@togatherlabs/shared-utils/logger';
import { EnvConfig } from './config/env.config';

const logger = new Logger(undefined, {
  nodeEnv: EnvConfig.NODE_ENV,
  logLevel: EnvConfig.LOG_LEVEL,
  serviceName: EnvConfig.SERVICE_NAME
});
```
```

### Default Configuration

The logger comes with production-grade defaults:

```typescript
{
  level: 'info',
  base: {
    pid: process.pid,
    hostname: process.env.HOSTNAME || os.hostname(),
    service: process.env.SERVICE_NAME,
    environment: process.env.NODE_ENV,
  },
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  redact: {
    paths: [
      'password', '*.password',
      'token', '*.token',
      'accessToken', '*.accessToken',
      'refreshToken', '*.refreshToken',
      'secret', '*.secret',
      'authorization', '*.authorization',
      'cookie', '*.cookie',
      'apiKey', '*.apiKey',
    ],
    remove: true, // In production, false in development
  },
}
```

## Log Levels

From lowest to highest severity:

1. **trace**: Very detailed debugging information
2. **debug**: Debugging information
3. **info**: Informational messages (default)
4. **warn**: Warning messages
5. **error**: Error messages
6. **fatal**: Fatal errors (application crash)
