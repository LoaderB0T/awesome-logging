import { TextObject, TextValue } from './models/text-object';
import { AwesomeLoggerType, LoggerConfig, LoggerReturnType } from './logger/types/logger-type';
import { AwesomeLoggerBase } from './logger/models/logger-base';
import { AwesomeMultiLogger } from './logger/models/multi-logger';
import { AwesomeProgressLogger } from './logger/models/progress-logger';
import { AwesomeSpinnerLogger } from './logger/models/spinner-logger';
import { AwesomeTextLogger } from './logger/models/text-logger';
import { INSERT_LINE, MOVE_UP, INSERT_NEW_LINE, MOVE_LEFT, MOVE_DOWN, DELETE_LINE, HIDE_CURSOR } from './utils/ansi-utils';
import { AwesomeLoggerTextControl } from './logger/models/config/text';
import { AwesomePromptType, PromptConfig, PromptReturnType } from './interaction/types/prompt-type';
import { AwesomeTextPromt } from './interaction/models/text-prompt';
import { AwesomePromptBase } from './interaction/models/prompt-base';
import { AwesomeTogglePromt } from './interaction/models/toggle-prompt';
import { AwesomeChecklistLogger } from './logger/models/checklist-logger';

export class AwesomeLogger {
  private static activeLogger: AwesomeLoggerBase;
  private static _lastRenderedLines: TextObject[] | undefined;
  private static _lastScrollAmount: number = 0;
  public static maxLinesInTerminal: number = 5;

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
      case 'checklist': { logger = new AwesomeChecklistLogger(config); break; }
    }

    if (!logger) {
      throw new Error(`Logger type '${type}' not found`);
    }
    return logger as any as LoggerReturnType<T>;
  }

  private static visibleLineCount(allLines: TextObject[]): number {
    return Math.min(allLines.length, this.maxLinesInTerminal);
  }

  private static renderScrollWindow(allLines: TextObject[], scrollAmount: number) {
    const preDots = scrollAmount > 0;
    const postDots = scrollAmount < allLines.length - this.maxLinesInTerminal;
    const visibleLineCount = this.visibleLineCount(allLines);
    for (let i = 0; i < visibleLineCount; i++) {
      if (preDots && i === 0) {
        process.stdout.write(new TextObject('...', 'GRAY').toLineString(this._lastRenderedLines?.[0]));
      } else if (postDots && i === visibleLineCount - 1) {
        process.stdout.write(new TextObject('...', 'GRAY').toLineString(this._lastRenderedLines?.[this._lastRenderedLines.length - 1]));
      } else {
        const line = allLines[i + scrollAmount];
        process.stdout.write(line.toLineString(this._lastRenderedLines?.[i + this._lastScrollAmount]));
      }
      INSERT_LINE();
    }
    this._lastScrollAmount = scrollAmount;
  }

  public static log<T extends AwesomeLoggerType>(type: T, config: LoggerConfig<T>): LoggerReturnType<T> {
    const loggerReturnType = this.create(type, config);
    const logger = loggerReturnType as AwesomeLoggerBase;
    const renderedLines = logger.render().allLines();
    this.renderScrollWindow(renderedLines, logger.scrollAmount);

    this._lastRenderedLines = renderedLines;
    this.activeLogger = logger;
    return loggerReturnType;
  }

  public static interrupt<T extends AwesomeLoggerType>(type: T, config: LoggerConfig<T>): void {
    const logger = this.create(type, config) as any as AwesomeLoggerBase;
    const renderedText = logger.render().toLineString();
    const renderedLines = renderedText?.split(/[\r\n|\n|\r]/g);

    if (!this.activeLogger || !this._lastRenderedLines) {
      throw new Error('Cannot interrupt if no logger is active');
    }
    if (!renderedLines) {
      return;
    }

    const visibleLines = this.visibleLineCount(this._lastRenderedLines ?? []);
    renderedLines.forEach(renderedLine => {
      MOVE_UP(visibleLines);
      INSERT_NEW_LINE();
      process.stdout.write(renderedLine);
      MOVE_LEFT();
      MOVE_DOWN(visibleLines);
      INSERT_LINE();
    });
  }

  public static loggerChanged(calledFrom: AwesomeLoggerBase) {
    const validCaller = this.activeLogger.canBeCalledFrom(calledFrom);
    if (!validCaller) {
      throw new Error('This logger is not active anymore');
    }

    HIDE_CURSOR();

    const renderedLines = this.activeLogger.render().allLines();
    if (!renderedLines) {
      return;
    }

    const lastLineCount = this._lastRenderedLines?.length ?? 0;
    const newLineCount = renderedLines.length ?? 0;

    const visibleLines = this.visibleLineCount(this._lastRenderedLines ?? []);
    if (visibleLines < this.maxLinesInTerminal) {
      const moreLines = newLineCount - lastLineCount;
      if (moreLines > 0) {
        for (let i = 0; i < moreLines; i++) {
          INSERT_LINE();
        }
      }
    }
    if (newLineCount < this.maxLinesInTerminal) {
      const lessLines = lastLineCount - newLineCount;
      if (lessLines > 0) {
        MOVE_UP(lessLines);
        for (let i = 0; i < lessLines; i++) {
          DELETE_LINE();
        }
      }
    }

    MOVE_UP(this.visibleLineCount(renderedLines));

    this.renderScrollWindow(renderedLines, this.activeLogger.scrollAmount);
    this._lastRenderedLines = renderedLines;
  }

  public static prompt<T extends AwesomePromptType>(type: T, config: PromptConfig<T>): PromptReturnType<T> {
    let prompt: AwesomePromptBase<any> | undefined = undefined;

    switch (type) {
      case 'text': { prompt = new AwesomeTextPromt(config); break; }
      case 'toggle': { prompt = new AwesomeTogglePromt(config); break; }
    }

    if (!prompt) {
      throw new Error(`Logger type '${type}' not found`);
    }

    this.activeLogger = prompt;

    const renderedLines = prompt.render().allLines();

    this.renderScrollWindow(renderedLines, prompt.scrollAmount);

    this._lastRenderedLines = renderedLines;
    prompt.init();
    prompt.waitForUserInput();

    return prompt as any as PromptReturnType<T>;
  }
}
