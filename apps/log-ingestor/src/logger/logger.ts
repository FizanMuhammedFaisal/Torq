
import { Envconfig } from '../envConfig';
import { Logger } from './loggerConfig';

export const logger = new Logger({ config: { nodeEnv: Envconfig.app.nodeEnv, serviceName: Envconfig.app.name } });
