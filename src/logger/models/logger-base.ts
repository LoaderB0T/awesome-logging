import { AwesomeLogger } from '../../awesome-logger';
import { TextObject } from '../../models/text-object';
import { DELETE_LINE, HIDE_CURSOR, MOVE_UP } from '../../utils/ansi-utils';

export abstract class AwesomeLoggerBase {
  private static currentKeyListener?: (value: string) => any;
  public static isInitialized = false;

  public scrollAmount: number = 0;
  private _lastLine: TextObject;
  protected _hasChanges: boolean = true;
  private readonly _readStream: NodeJS.ReadStream;

  constructor() {
    this._lastLine = new TextObject('');
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
        AwesomeLoggerBase.currentKeyListener?.(key.toString());
      });
      process.stdin.pause();
    }
  }

  public static changeKeyListener(listener?: (val: string) => any) {
    this.currentKeyListener = listener;
    if (!this.currentKeyListener) {
      process.stdin.pause();
    } else {
      process.stdin.resume();
    }
  }

  public abstract getNextLine(): TextObject;
  public abstract hasChanges(): boolean;
  public abstract canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean;
  public abstract needsScroll(): boolean;

  protected changed() {
    this._hasChanges = true;
    AwesomeLogger.loggerChanged(this);
  }

  public render(): TextObject {
    if (!this.hasChanges()) {
      return this._lastLine;
    }
    this._hasChanges = false;
    const newLine = this.getNextLine();

    this._lastLine = newLine;
    return newLine;
  }

  public clean(): void {
    if (!this._lastLine) {
      return;
    }

    const visibleLines = AwesomeLogger.visibleLineCount(this._lastLine.allLines() ?? []);
    for (let i = 0; i < visibleLines; i++) {
      DELETE_LINE();
      MOVE_UP(1);
    }
  }
}
