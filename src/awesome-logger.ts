import { LoggerCreator } from './logger/logger-creator.js';
import { LoggerManager } from './logger/logger-manager.js';
import { AwesomeLoggerType, LoggerConfig, LoggerReturnType } from './logger/logger-type.js';
import { PromptCreator } from './prompt/prompt-creator.js';
import { AwesomePromptType, PromptConfig, PromptReturnType } from './prompt/prompt-type.js';

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

  /**
   * Log a message to the console
   * @param text The text to log
   */
  public static log<T extends 'text'>(text: string): LoggerReturnType<T>;
  /**
   * Log to the console with a previously created logger
   * @param logger The logger to log
   */
  public static log<T extends AwesomeLoggerType>(logger: LoggerReturnType<T>): LoggerReturnType<T>;
  /**
   * Create a new logger and log to the console
   * @param type The type of logger to create
   * @param config The config for the logger
   */
  public static log<T extends AwesomeLoggerType>(type: T, config: LoggerConfig<T>): LoggerReturnType<T>;
  // @internal
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

  /**
   * Prompt the user for input
   * @param type The type of prompt to create
   * @param config  The config for the prompt
   * @returns The prompt with the `returnValue` promise
   */
  public static prompt<T extends AwesomePromptType>(type: T, config: PromptConfig<T>): PromptReturnType<T> {
    const prompt = PromptCreator.create(type, config);
    LoggerManager.getInstance().prompt(prompt);
    return prompt;
  }

  /**
   * Log a message to the console while a logger or prompt is running
   * @param text The text to log
   */
  public static interrupt(text: string) {
    LoggerManager.getInstance().interrupt(text);
  }
}
