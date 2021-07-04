import { StringTrimmer } from '../render/string-trimmer';
import { StringRenderer } from '../render/string-renderer';
import { HIDE_CURSOR } from '../utils/ansi-utils';
import { ConsoleLog } from '../utils/console-log';
import { AwesomeLoggerBase } from './logger-base';
import { AwesomePromptBase } from '../prompt/models/prompt-base';
import { AwesomeLogger } from '../awesome-logger';

// @internal
export class LoggerManager {
  private static _instance: LoggerManager;

  private readonly _readStream?: NodeJS.ReadStream;
  private _currentKeyListener?: (value: string) => any;
  private _activeLogger?: AwesomeLoggerBase;
  private _cangeDetection: boolean = true;

  constructor() {
    ConsoleLog.log = console.log;
    console.log = (message?: any) => {
      AwesomeLogger.log('text', { text: message });
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
    if (!this._cangeDetection) {
      return;
    }

    const validCaller = this._activeLogger!.canBeCalledFrom(calledFrom);
    if (!validCaller) {
      throw new Error('This logger is not active anymore');
    }

    HIDE_CURSOR();

    const renderedLines = this._activeLogger!.render();
    if (!renderedLines) {
      return;
    }

    const trimmedLines = StringTrimmer.ensureConsoleFit(renderedLines, true);

    StringRenderer.renderString(trimmedLines, false, false, false);
  }

  public logRestricted(text: string) {
    StringRenderer.renderString(text, true, true, true);
  }

  public log(logger: AwesomeLoggerBase) {
    this._activeLogger?.end();

    const renderedLines = logger.render();
    const trimmedLines = StringTrimmer.ensureConsoleFit(renderedLines, true);
    StringRenderer.renderString(trimmedLines, false, true, true);
    this._activeLogger = logger;
  }

  public prompt(prompt: AwesomePromptBase<any>) {
    this.runWithoutChangeDetection(() => {
      prompt.init();
    });
    this.changeKeyListener(key => prompt.gotKey(key));

    this.log(prompt);
  }

  public interrupt(text: string) {
    StringRenderer.renderString(text, true, false, false);
    const activeLoggerText = this._activeLogger?.render();
    if (activeLoggerText) {
      StringRenderer.renderString(activeLoggerText, false, false, true);
    }
  }

  public runWithoutChangeDetection(run: () => void) {
    this._cangeDetection = false;
    run();
    this._cangeDetection = true;
  }

  public clearLogger() {
    this._activeLogger = undefined;
  }
}
