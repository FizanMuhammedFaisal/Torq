import { Envconfig } from '@/config/envconfig';
import { Logger } from './loggerConfig';

export const logger = new Logger({ config: { serviceName: Envconfig.app.name } });
