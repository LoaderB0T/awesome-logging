import { StringTrimmer } from '../render/string-trimmer';
import { StringRenderer } from '../render/string-renderer';
import { HIDE_CURSOR } from '../utils/ansi-utils';
import { ConsoleLog } from '../utils/console-log';
import { AwesomeLoggerBase } from './logger-base';
import { AwesomePromptBase } from '../prompt/models/prompt-base';

export class LoggerManager {
  private static _instance: LoggerManager;

  private readonly _readStream?: NodeJS.ReadStream;
  private _currentKeyListener?: (value: string) => any;
  private _activeLogger?: AwesomeLoggerBase;

  constructor() {
    ConsoleLog.log = console.log;
    console.log = (message?: any) => {
      throw new Error('console.log cannot be used');
    };
    HIDE_CURSOR();
    if (!AwesomeLoggerBase.isInitialized) {
      AwesomeLoggerBase.isInitialized = true;
      const stdin = process.stdin;
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');
      this._readStream = stdin.on('data', key => {
        // ctrl-c ( end of text )
        if (key.toString() === '\u0003') {
          process.exit();
        }
        this._currentKeyListener?.(key.toString());
      });
    }
  }

  public changeKeyListener(listener?: (val: string) => any) {
    this._currentKeyListener = listener;
    if (!this._currentKeyListener) {
      process.stdin.pause();
    } else {
      process.stdin.resume();
    }
  }

  public static getInstance(): LoggerManager {
    if (!this._instance) {
      this._instance = new LoggerManager();
    }
    return this._instance;
  }

  public loggerChanged(calledFrom: AwesomeLoggerBase) {
    const validCaller = this._activeLogger!.canBeCalledFrom(calledFrom);
    if (!validCaller) {
      throw new Error('This logger is not active anymore');
    }

    HIDE_CURSOR();

    const renderedLines = this._activeLogger!.render();
    if (!renderedLines) {
      return;
    }

    // if (AwesomeLogger.restrictedLogging) {
    //   for (let i = 0; i < renderedLines.length; i++) {
    //     const line = renderedLines[i];
    //     const changedLine = line.toLineString(this._lastRenderedLines?.[i]);
    //     if (changedLine) {
    //       console.log(line.toLineString());
    //     }
    //     if (this._lastRenderedLines) {
    //       this._lastRenderedLines[i] = line;
    //     }
    //   }
    //   return;
    // }

    const trimmedLines = StringTrimmer.ensureConsoleFit(renderedLines);

    StringRenderer.renderString(trimmedLines, false, false);
  }

  log(logger: AwesomeLoggerBase) {
    const renderedLines = logger.render();
    const trimmedLines = StringTrimmer.ensureConsoleFit(renderedLines);
    StringRenderer.renderString(trimmedLines, false, true);
    this._activeLogger = logger;
  }

  prompt(prompt: AwesomePromptBase<any>) {
    const renderedLines = prompt.render();
    const trimmedLines = StringTrimmer.ensureConsoleFit(renderedLines);
    this._activeLogger = prompt;
    prompt.init();
    this.changeKeyListener(key => prompt.gotKey(key));
    StringRenderer.renderString(trimmedLines, false, true);
  }
}
