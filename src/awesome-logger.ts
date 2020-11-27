import { TextObject, TextValue } from './models/text-object';
import { AwesomeLoggerType, LoggerConfig, LoggerReturnType } from './logger/types/logger-type';
import { AwesomeLoggerBase } from './logger/models/logger-base';
import { AwesomeMultiLogger } from './logger/models/multi-logger';
import { AwesomeProgressLogger } from './logger/models/progress-logger';
import { AwesomeSpinnerLogger } from './logger/models/spinner-logger';
import { AwesomeTextLogger } from './logger/models/text-logger';
import { INSERT_LINE, MOVE_UP, INSERT_NEW_LINE, MOVE_LEFT, MOVE_DOWN, DELETE_LINE } from './utils/ansi-utils';
import { StringUtils } from './utils/string-utils';
import { AwesomeLoggerTextControl } from './logger/models/config/text';
import { AwesomePromptType, PromptConfig, PromptReturnType } from './interaction/types/prompt-type';
import { AwesomeTextPromt } from './interaction/models/text-prompt';
import { AwesomePromptBase } from './interaction/models/prompt-base';

export class AwesomeLogger {
  private static activeLogger: AwesomeLoggerBase;
  private static _lastRenderedLines: string[] | undefined;

  public static logText(text: string | TextValue): AwesomeLoggerTextControl {
    return this.log('text', { text });
  }


  public static create<T extends AwesomeLoggerType>(type: T, config?: LoggerConfig<T>): LoggerReturnType<T> {

    let logger: AwesomeLoggerBase | undefined = undefined;

    switch (type) {
      case 'text': { logger = new AwesomeTextLogger(config); break; }
      case 'progress': { logger = new AwesomeProgressLogger(config); break; }
      case 'spinner': { logger = new AwesomeSpinnerLogger(config); break; }
      case 'multi': { logger = new AwesomeMultiLogger(config); break; }
    }

    if (!logger) {
      throw new Error(`Logger type '${type}' not found`);
    }
    return logger as any as LoggerReturnType<T>;
  }

  public static log<T extends AwesomeLoggerType>(type: T, config: LoggerConfig<T>): LoggerReturnType<T> {

    const logger = this.create(type, config) as AwesomeLoggerBase;

    const renderedText = logger.render().toString();
    const renderedLines = renderedText?.split(/[\r\n|\n|\r]/g);
    this._lastRenderedLines = renderedLines;

    renderedLines?.forEach(line => {
      process.stdout.write(line);
      INSERT_LINE();
    });

    this.activeLogger = logger;
    return logger as LoggerReturnType<T>;
  }

  public static interrupt<T extends AwesomeLoggerType>(type: T, config: LoggerConfig<T>): void {
    const logger = this.create(type, config) as AwesomeLoggerBase;
    const renderedText = logger.render().toString();
    const renderedLines = renderedText?.split(/[\r\n|\n|\r]/g);

    if (!this.activeLogger || !this._lastRenderedLines) {
      throw new Error('Cannot interrupt if no logger is active');
    }
    if (!renderedLines) {
      return;
    }

    renderedLines.forEach(renderedLine => {
      MOVE_UP(this._lastRenderedLines!.length);
      INSERT_NEW_LINE();
      process.stdout.write(renderedLine);
      MOVE_LEFT();
      MOVE_DOWN(this._lastRenderedLines!.length);
      INSERT_LINE();
    });
  }

  public static loggerChanged(calledFrom: AwesomeLoggerBase) {
    const validCaller = this.activeLogger.canBeCalledFrom(calledFrom);
    if (!validCaller) {
      throw new Error('This logger is not active anymore');
    }

    // HIDE_CURSOR();
    const renderedText = this.activeLogger.render().toString();
    const renderedLines = renderedText?.split(/[\r\n]/g);


    if (!renderedLines) {
      return;
    }

    const lastLineCount = this._lastRenderedLines?.length ?? 0;
    const newLineCount = renderedLines.length ?? 0;

    const moreLines = newLineCount - lastLineCount;
    if (moreLines > 0) {
      for (let i = 0; i < moreLines; i++) {
        INSERT_LINE();
      }
    }

    const lessLines = lastLineCount - newLineCount;
    if (lessLines > 0) {
      MOVE_UP(lessLines);
      for (let i = 0; i < lessLines; i++) {
        DELETE_LINE();
      }
    }


    MOVE_UP(newLineCount);

    // const trimmedLines = StringUtils.trimLines(renderedLines, this._lastRenderedLines);

    renderedLines?.forEach(line => {
      if (line) {
        process.stdout.write(line);
      }
      console.log();
    });
    this._lastRenderedLines = renderedLines;
  }



  public static prompt<T extends AwesomePromptType>(type: T, config: PromptConfig<T>): PromptReturnType<T> {
    let prompt: AwesomePromptBase | undefined = undefined;

    switch (type) {
      case 'text': { prompt = new AwesomeTextPromt(config); break; }
    }

    if (!prompt) {
      throw new Error(`Logger type '${type}' not found`);
    }

    this.activeLogger = prompt;


    const renderedText = prompt.render().toString();
    const renderedLines = renderedText?.split(/[\r\n|\n|\r]/g);
    this._lastRenderedLines = renderedLines;

    renderedLines?.forEach(line => {
      process.stdout.write(line);
      INSERT_LINE();
    });

    prompt.init();
    prompt.waitForUserInput();

    return prompt as any as PromptReturnType<T>;
  }
}
