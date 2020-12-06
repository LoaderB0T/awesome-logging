import { AwesomeLogger } from '../../awesome-logger';
import { TextObject } from '../../models/text-object';
import { HIDE_CURSOR } from '../../utils/ansi-utils';

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

}
