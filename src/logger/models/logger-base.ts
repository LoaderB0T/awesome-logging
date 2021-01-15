import { AwesomeLogger } from '../../awesome-logger';
import { TextObject } from '../../models/text-object';
import { DELETE_LINE, HIDE_CURSOR, MOVE_UP } from '../../utils/ansi-utils';

export abstract class AwesomeLoggerBase {
  public scrollAmount: number = 0;
  private _lastLine: TextObject;
  protected _hasChanges: boolean = true;

  constructor() {
    this._lastLine = new TextObject('');
    HIDE_CURSOR();
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

    const visibleLines = AwesomeLoggerBase.visibleLineCount(this._lastLine.allLines() ?? []);
    for (let i = 0; i < visibleLines; i++) {
      MOVE_UP(1);
      DELETE_LINE();
    }
  }

  private static visibleLineCount(allLines: TextObject[]): number {
    return Math.min(allLines.length, AwesomeLogger.maxLinesInTerminal);
  }

}
