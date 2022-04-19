import { AwesomeLogger } from './awesome-logger.js';
import { LoggerManager } from './logger/logger-manager.js';

export * from './awesome-logger';
export * from './logger';
export * from './prompt';

// This is a workaround for initializing the static AwesomeLogger before everything else
AwesomeLogger.init();

LoggerManager.getInstance();
