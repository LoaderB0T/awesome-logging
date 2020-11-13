import { AwesomeMultiLogger } from "./logger/multi-logger";
import { AwesomeProgressLogger } from "./logger/progress-logger";
import { AwesomeTextLogger } from "./logger/text-logger";
import { AwesomeLoggerTextControl } from "./models/config/text";
import { AwesomeLoggerBase } from "./models/logger-base";
import { TextObject } from "./models/text-object";
import { DELETE_LINE, HIDE_CURSOR, INSERT_LINE, MOVE_UP } from "./ansi-utils";
import { StringUtils } from "./string-utils";
import { ExtractLoggerType } from "./types/extract-logger-type";
import { AwesomeLoggerDefinitions } from "./types/logger-definitions";
import { AwesomeLoggerType } from "./types/logger-type";
import { AwesomeSpinnerLogger } from "./logger/spinner-logger";

export class AwesomeLogger {
  private static activeLogger: AwesomeLoggerBase;
  private static _lastRenderedLines: string[] | undefined;

  public static logText(text: string | TextObject | TextObject[]): AwesomeLoggerTextControl {
    return this.log('text', { text });
  }

  public static create<T extends AwesomeLoggerType>(type: T, config: Partial<ExtractLoggerType<AwesomeLoggerDefinitions, T>['config']>): ExtractLoggerType<AwesomeLoggerDefinitions, T>['returnValue'] {
    let logger: AwesomeLoggerBase | undefined = undefined;

    switch (type) {
      case 'text': { logger = new AwesomeTextLogger(config); break; }
      case 'progress': { logger = new AwesomeProgressLogger(config); break; }
      case 'spinner': { logger = new AwesomeSpinnerLogger(config); break; }
      case 'multi': { logger = new AwesomeMultiLogger(config); break; }
    }

    if (!logger) {
      throw new Error('Logger type \'' + type + '\' not found');
    }
    return logger as any as ExtractLoggerType<AwesomeLoggerDefinitions, T>['returnValue'];
  }

  public static log<T extends AwesomeLoggerType>(type: T, config: Partial<ExtractLoggerType<AwesomeLoggerDefinitions, T>['config']>): ExtractLoggerType<AwesomeLoggerDefinitions, T>['returnValue'] {
    const logger = this.create(type, config) as AwesomeLoggerBase;

    const renderedText = logger['render']();
    const renderedLines = renderedText?.split(/[\r\n|\n|\r]/g);
    this._lastRenderedLines = renderedLines;

    renderedLines?.forEach(line => {
      process.stdout.write(line);
      console.log();
    });
    this.activeLogger = logger;
    return logger as ExtractLoggerType<AwesomeLoggerDefinitions, T>['returnValue'];
  }

  // Does get called from outside
  private static loggerChanged() {
    HIDE_CURSOR();
    const renderedText = this.activeLogger['render']();
    const renderedLines = renderedText?.split(/[\r\n|\n|\r]/g);


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

    const trimmedLines = StringUtils.trimLines(renderedLines, this._lastRenderedLines);

    trimmedLines?.forEach(line => {
      if (line) {
        process.stdout.write(line);
      }
      console.log();
    });
    this._lastRenderedLines = renderedLines;
  }



  // public static logCustom(name: string, config: any) {
  // }
};
