import { AwesomeLoggerBase } from './logger/logger-base';
import { LoggerCreator } from './logger/logger-creator';
import { LoggerManager } from './logger/logger-manager';
import { AwesomeLoggerType, LoggerConfig, LoggerReturnType } from './logger/logger-type';
import { PromptCreator } from './prompt/prompt-creator';
import { AwesomePromptType, PromptConfig, PromptReturnType } from './prompt/prompt-type';

LoggerManager.getInstance();
export class AwesomeLogger {
  public static restrictedLogging = false;

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
    const logger =
      typeof param1 === 'object'
        ? param1
        : !!param2
        ? LoggerCreator.create(param1 as T, param2!)
        : (AwesomeLogger.create('text', { text: param1 }) as LoggerReturnType<T>);

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
