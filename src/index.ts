import { AwesomeLogger } from './awesome-logger';
import { LoggerManager } from './logger/logger-manager';

export * from './awesome-logger';
export * from './logger';
export * from './prompt';

AwesomeLogger.restrictedLogging;
LoggerManager.getInstance();
