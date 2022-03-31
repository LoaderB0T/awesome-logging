import { AwesomeLogger } from './awesome-logger';
import { LoggerManager } from './logger/logger-manager';

export * from './awesome-logger';
export * from './logger';
export * from './prompt';

// This is a workaround for initializing the static AwesomeLogger class before everything else
AwesomeLogger.restrictedLogging;

LoggerManager.getInstance();
