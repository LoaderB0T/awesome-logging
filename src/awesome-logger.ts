import { AwesomeLoggerBase } from './logger/logger-base';
import { LoggerCreator } from './logger/logger-creator';
import { LoggerManager } from './logger/logger-manager';
import { AwesomeLoggerType, LoggerConfig, LoggerReturnType } from './logger/logger-type';

LoggerManager.getInstance();
export class AwesomeLogger {
  public static create<T extends AwesomeLoggerType>(type: T, config?: LoggerConfig<T>): LoggerReturnType<T> {
    const loggerReturnType = LoggerCreator.create(type, config);
    return loggerReturnType;
  }

  public static log<T extends AwesomeLoggerType>(type: T, config: LoggerConfig<T>): LoggerReturnType<T> {
    const loggerReturnType = LoggerCreator.create(type, config);
    const logger = loggerReturnType as AwesomeLoggerBase;
    LoggerManager.getInstance().log(logger);
    return loggerReturnType;
  }
}
