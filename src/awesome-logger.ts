import { TextObject, TextValue } from './models/text-object';
import { AwesomeLoggerType, LoggerConfig, LoggerReturnType } from './logger/types/logger-type';
import { AwesomeLoggerBase } from './logger/models/logger-base';
import { AwesomeMultiLogger } from './logger/models/multi-logger';
import { AwesomeProgressLogger } from './logger/models/progress-logger';
import { AwesomeSpinnerLogger } from './logger/models/spinner-logger';
import { AwesomeTextLogger } from './logger/models/text-logger';
import { INSERT_LINE, MOVE_UP, DELETE_LINE, HIDE_CURSOR, MOVE_LEFT } from './utils/ansi-utils';
import { AwesomeLoggerTextControl } from './logger/models/config/text';
import { AwesomePromptType, PromptConfig, PromptReturnType } from './interaction/types/prompt-type';
import { AwesomeTextPromt } from './interaction/models/text-prompt';
import { AwesomePromptBase } from './interaction/models/prompt-base';
import { AwesomeTogglePromt } from './interaction/models/toggle-prompt';
import { AwesomeChecklistLogger } from './logger/models/checklist-logger';

export class AwesomeLogger {
  private static activeLogger?: AwesomeLoggerBase;
  private static _lastRenderedLines: TextObject[] | undefined;
  private static _maxLinesInTerminal: number = 25;
  public static restrictedLogging: boolean = false;

  public static get maxLinesInTerminal(): number {
    const terminalSize = process.stdout?.getWindowSize?.();
    const maxPrintHeight = terminalSize?.[1] ?? this._maxLinesInTerminal;
    return Math.min(maxPrintHeight, this._maxLinesInTerminal);
  }

  public static set maxLinesInTerminal(value: number) {
    this._maxLinesInTerminal = value;
  }

  public static logText(text: string | TextValue): AwesomeLoggerTextControl {
    return this.log('text', { text });
  }

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
    return (logger as any) as LoggerReturnType<T>;
  }

  public static visibleLineCount(allLines: TextObject[]): number {
    return Math.min(allLines.length, this.maxLinesInTerminal);
  }

  private static renderScrollWindow(allLines: TextObject[], scrollAmount: number, needsScroll: boolean) {
    if (this.maxLinesInTerminal > allLines.length) {
      needsScroll = false;
    }
    if (!needsScroll) {
      for (let i = 0; i < allLines.length; i++) {
        if (i !== 0) {
          INSERT_LINE();
        } else {
          MOVE_LEFT();
        }
        const line = allLines[i];
        process.stdout.write(line.toLineString(this._lastRenderedLines?.[i]));
      }
      this._lastRenderedLines = allLines;
      return;
    }

    if (scrollAmount === 1) {
      scrollAmount = 0;
    }

    const maxScrollAmount = allLines.length - this.maxLinesInTerminal + 1;
    if (scrollAmount > maxScrollAmount && maxScrollAmount > 0) {
      scrollAmount = maxScrollAmount;
    }

    const preDots = scrollAmount > 0;
    const postDots = scrollAmount <= allLines.length - this.maxLinesInTerminal;

    const acutalLines = new Array<TextObject>(this.maxLinesInTerminal);
    const lineRenderCount = this.maxLinesInTerminal - (preDots ? 1 : 0) - (postDots ? 1 : 0);
    if (preDots) {
      acutalLines[0] = new TextObject(' ↑  ...', 'GRAY');
    }
    if (postDots) {
      acutalLines[acutalLines.length - 1] = new TextObject(' ↓  ...', 'GRAY');
    }
    for (let i = 0; i < lineRenderCount; i++) {
      const line = allLines[i + scrollAmount];
      acutalLines[i + (preDots ? 1 : 0)] = line;
    }

    for (let i = 0; i < acutalLines.length; i++) {
      const line = acutalLines[i];
      // if (i !== 0) {
      INSERT_LINE();
      // } else {
      //   MOVE_LEFT();
      // }
      const text = line.toLineString(this._lastRenderedLines?.[i]);
      process.stdout.write(text);
    }

    this._lastRenderedLines = acutalLines;
  }

  public static log<T extends AwesomeLoggerType>(type: T, config: LoggerConfig<T>): LoggerReturnType<T> {
    const loggerReturnType = this.create(type, config);
    const logger = loggerReturnType as AwesomeLoggerBase;
    const renderedLines = logger.render().allLines();
    this.renderScrollWindow(renderedLines, logger.scrollAmount, logger.needsScroll());
    this.activeLogger = logger;
    return loggerReturnType;
  }

  public static interrupt<T extends AwesomeLoggerType>(type: T, config: LoggerConfig<T>): void {
    if (!this.activeLogger || !this._lastRenderedLines) {
      const noActiveLogger = !this.activeLogger;
      const noLastRenderedLines = !this._lastRenderedLines;
      this.log(type, config);
      if (noLastRenderedLines) {
        this._lastRenderedLines = undefined;
      }
      if (noActiveLogger) {
        this.activeLogger = undefined;
      }
      return;
    }

    const logger = (this.create(type, config) as any) as AwesomeLoggerBase;
    const interruptText = logger.render().toString();
    if (!interruptText) {
      return;
    }

    this._lastRenderedLines = undefined;
    const renderedLines = this.activeLogger.render().allLines();

    if (!AwesomeLogger.restrictedLogging) {
      this.activeLogger.clean();
    }
    INSERT_LINE();
    process.stdout.write(interruptText);
    if (!AwesomeLogger.restrictedLogging) {
      this.renderScrollWindow(renderedLines, this.activeLogger.scrollAmount, this.activeLogger.needsScroll());
    }
  }

  public static loggerChanged(calledFrom: AwesomeLoggerBase) {
    const validCaller = this.activeLogger!.canBeCalledFrom(calledFrom);
    if (!validCaller) {
      throw new Error('This logger is not active anymore');
    }

    HIDE_CURSOR();

    const renderedLines = this.activeLogger!.render().allLines();
    if (!renderedLines) {
      return;
    }

    if (AwesomeLogger.restrictedLogging) {
      for (let i = 0; i < renderedLines.length; i++) {
        const line = renderedLines[i];
        const changedLine = line.toLineString(this._lastRenderedLines?.[i]);
        if (changedLine) {
          console.log(line.toLineString());
        }
        if (this._lastRenderedLines) {
          this._lastRenderedLines[i] = line;
        }
      }
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
        MOVE_UP(lessLines - 1);
        for (let i = 0; i < lessLines; i++) {
          DELETE_LINE();
        }
        MOVE_UP(1);
      }
    }

    MOVE_UP(this.visibleLineCount(renderedLines) - 1);

    this.renderScrollWindow(renderedLines, this.activeLogger!.scrollAmount, this.activeLogger!.needsScroll());
  }

  public static prompt<T extends AwesomePromptType>(type: T, config: PromptConfig<T>): PromptReturnType<T> {
    let prompt: AwesomePromptBase<any> | undefined = undefined;

    switch (type) {
      case 'text': {
        prompt = new AwesomeTextPromt(config);
        break;
      }
      case 'toggle': {
        prompt = new AwesomeTogglePromt(config);
        break;
      }
    }

    if (!prompt) {
      throw new Error(`Logger type '${type}' not found`);
    }

    this.activeLogger = prompt;

    if (AwesomeLogger.restrictedLogging) {
      throw new Error('Restricted logging is enabled. Cannot use propmts');
    }

    const renderedLines = prompt.render().allLines();

    this.renderScrollWindow(renderedLines, prompt.scrollAmount, prompt.needsScroll());
    prompt.init();
    prompt.waitForUserInput();

    return (prompt as any) as PromptReturnType<T>;
  }
}
