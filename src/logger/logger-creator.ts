import { AwesomeLoggerBase } from './logger-base';
import { AwesomeLoggerType, LoggerConfig, LoggerReturnType } from './logger-type';
import { AwesomeTextLogger } from './models/text-logger';

export class LoggerCreator {
  public static create<T extends AwesomeLoggerType>(type: T, config?: LoggerConfig<T>): LoggerReturnType<T> {
    let logger: AwesomeLoggerBase | undefined = undefined;

    switch (type) {
      case 'text': {
        logger = new AwesomeTextLogger(config);
        break;
      }
    }

    if (!logger) {
      throw new Error(`Logger type '${type}' not found`);
    }
    return (logger as any) as LoggerReturnType<T>;
  }
}
