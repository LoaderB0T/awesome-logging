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

  public static log<T extends AwesomeLoggerType>(type: T, config: LoggerConfig<T>): LoggerReturnType<T> {
    const logger = LoggerCreator.create(type, config);
    LoggerManager.getInstance().log(logger);
    return logger;
  }

  public static prompt<T extends AwesomePromptType>(type: T, config: PromptConfig<T>): PromptReturnType<T> {
    const prompt = PromptCreator.create(type, config);
    LoggerManager.getInstance().prompt(prompt);
    return prompt;
  }
}
