import { StringTrimmer } from '../render/string-trimmer';
import { StringRenderer } from '../render/string-renderer';
import { CONTROL_PREFIX_FIRST_CHAR, HIDE_CURSOR } from '../utils/ansi-utils';
import { ConsoleLog } from '../utils/console-log';
import { AwesomeLoggerBase } from './logger-base';
import { AwesomePromptBase } from '../prompt/prompt-base';
import { AwesomeLogger } from '../awesome-logger';

// @internal
export class LoggerManager {
  private static _instance?: LoggerManager;

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
      stdin.setEncoding('utf8');
      this.changeKeyListener(undefined);
      let isIncomplete = false;
      let incompletePart = '';

      stdin.on('data', (key: Buffer) => {
        // ctrl-c / SIGINT ( end of text ) does not work with rawMode, so we handle it manually here
        // See https://nodejs.org/api/tty.html#tty_readstream_setrawmode_mode
        if (key.toString() === '\u0003') {
          process.exit();
        }

        // This incomplete logic is a workaround for stackblitz
        // where data is triggered on a per-character basis
        // This only happens in strange terminals like on stackblitz
        if (isIncomplete) {
          incompletePart += key;
          return;
        }
        if (key.toString() === CONTROL_PREFIX_FIRST_CHAR) {
          isIncomplete = true;
          incompletePart = CONTROL_PREFIX_FIRST_CHAR;
          setTimeout(() => {
            this._currentKeyListener?.(incompletePart);
            isIncomplete = false;
            incompletePart = '';
          }, 10);
          // Workaround End
        } else {
          this._currentKeyListener?.(key.toString());
        }
      });
    }
  }

  public get currentLoggerType(): string | undefined {
    return this._activeLogger?.type;
  }

  // @internal
  public _reset() {
    this._currentKeyListener = undefined;
    this._activeLogger = undefined;
    this._cangeDetection = true;
  }

  public changeKeyListener(listener?: (val: string) => any) {
    if (AwesomeLogger.restrictedLogging) {
      return;
    }
    this._currentKeyListener = listener;
    if (!this._currentKeyListener) {
      process.stdin.setRawMode?.(false);
      process.stdin.pause();
    } else {
      process.stdin.setRawMode?.(true);
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
    if (renderedLines === undefined) {
      return;
    }

    const trimmedLines = StringTrimmer.ensureConsoleFit(renderedLines, true, this._activeLogger!.scrollAmount);

    StringRenderer.renderString(trimmedLines, false, false, false);
  }

  public logRestricted(text: string) {
    StringRenderer.renderString(text, true, true, true);
  }

  public logEndOfLastLogger(text: string) {
    StringRenderer.renderString(text, true, true, false);
  }

  public log(logger: AwesomeLoggerBase) {
    this._activeLogger?.internalEnd();

    const renderedLines = logger.render();
    const trimmedLines = StringTrimmer.ensureConsoleFit(renderedLines, true, logger.scrollAmount);
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
    if (AwesomeLogger.restrictedLogging) {
      // We dont re-print anything if restricted logging is enables
      this.logRestricted(text);
      return;
    }

    // If there is no active logger continue with a normal log
    if (!this._activeLogger) {
      AwesomeLogger.log(text);
      return;
    }

    StringRenderer.renderString(text, true, false, false);
    const activeLoggerText = this._activeLogger.render();
    if (activeLoggerText) {
      const trimmedLines = StringTrimmer.ensureConsoleFit(activeLoggerText, true, this._activeLogger.scrollAmount);
      StringRenderer.renderString(trimmedLines, false, false, true);
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
