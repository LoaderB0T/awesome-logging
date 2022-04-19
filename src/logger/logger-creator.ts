import { AwesomeLoggerBase } from './logger-base.js';
import { AwesomeLoggerType, LoggerConfig, LoggerReturnType } from './logger-type.js';
import { AwesomeChecklistLogger } from './models/checklist-logger.js';
import { AwesomeMultiLogger } from './models/multi-logger.js';
import { AwesomeProgressLogger } from './models/progress-logger.js';
import { AwesomeSpinnerLogger } from './models/spinner-logger.js';
import { AwesomeTextLogger } from './models/text-logger.js';

// @internal
export class LoggerCreator {
  public static create<T extends AwesomeLoggerType>(type: T, config?: LoggerConfig<T>): LoggerReturnType<T> {
    let logger: AwesomeLoggerBase | undefined = undefined;

    switch (type) {
      case 'text': {
        logger = new AwesomeTextLogger(config);
        break;
      }
      case 'progress': {
        logger = new AwesomeProgressLogger(config);
        break;
      }
      case 'spinner': {
        logger = new AwesomeSpinnerLogger(config);
        break;
      }
      case 'multi': {
        logger = new AwesomeMultiLogger(config);
        break;
      }
      case 'checklist': {
        logger = new AwesomeChecklistLogger(config);
        break;
      }
    }

    if (!logger) {
      throw new Error(`Logger type '${type}' not found`);
    }
    return logger as LoggerReturnType<T>;
  }
}
