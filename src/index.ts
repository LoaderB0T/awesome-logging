import { AwesomeLogger } from './awesome-logger.js';
import { LoggerManager } from './logger/logger-manager.js';

export * from './awesome-logger.js';
export * from './logger/index.js';
export * from './prompt/index.js';

// This is a workaround for initializing the static AwesomeLogger before everything else
AwesomeLogger.init();

LoggerManager.getInstance();
