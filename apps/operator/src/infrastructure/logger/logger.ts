import { Envconfig } from '@/config/envconfig';
import { Logger } from './loggerConfig';

export const logger = new Logger({ config: { nodeEnv: Envconfig.app.nodeEnv, serviceName: Envconfig.app.name } });
