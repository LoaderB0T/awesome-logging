import { LoggerCreator } from './logger/logger-creator';
import { LoggerManager } from './logger/logger-manager';
import { AwesomeLoggerType, LoggerConfig, LoggerReturnType } from './logger/logger-type';
import { PromptCreator } from './prompt/prompt-creator';
import { AwesomePromptType, PromptConfig, PromptReturnType } from './prompt/prompt-type';

export class AwesomeLogger {
  public static restrictedLogging = false;

  public static get currentLoggerType(): string | undefined {
    return LoggerManager.getInstance().currentLoggerType;
  }

  public static init() {
    // Nothing to do here, just making sure this class is initialized
  }

  public static create<T extends AwesomeLoggerType>(type: T, config?: LoggerConfig<T>): LoggerReturnType<T> {
    const loggerReturnType = LoggerCreator.create(type, config);
    return loggerReturnType;
  }

  public static log<T extends 'text'>(text: string): LoggerReturnType<T>;
  public static log<T extends AwesomeLoggerType>(logger: LoggerReturnType<T>): LoggerReturnType<T>;
  public static log<T extends AwesomeLoggerType>(type: T, config: LoggerConfig<T>): LoggerReturnType<T>;
  public static log<T extends AwesomeLoggerType>(
    param1: T | LoggerReturnType<T> | string,
    param2?: LoggerConfig<T>
  ): LoggerReturnType<T> {
    let logger: LoggerReturnType<T>;

    if (typeof param1 === 'object') {
      // Got a logger
      logger = param1;
    } else {
      if (param2) {
        // Got a config
        logger = LoggerCreator.create(param1 as T, param2);
      } else {
        // Got a string that is not a loggerType -> text log
        logger = <LoggerReturnType<T>>AwesomeLogger.create('text', { text: param1 });
      }
    }

    LoggerManager.getInstance().log(logger);
    return logger;
  }

  public static prompt<T extends AwesomePromptType>(type: T, config: PromptConfig<T>): PromptReturnType<T> {
    const prompt = PromptCreator.create(type, config);
    LoggerManager.getInstance().prompt(prompt);
    return prompt;
  }

  public static interrupt(text: string) {
    LoggerManager.getInstance().interrupt(text);
  }
}
