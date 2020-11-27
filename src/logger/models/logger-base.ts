import { AwesomeLogger } from '../../awesome-logger';
import { TextObject } from '../../models/text-object';

export abstract class AwesomeLoggerBase {

  private _lastLine: TextObject;
  protected _hasChanges: boolean = true;

  constructor() {
    this._lastLine = new TextObject('');
  }

  public abstract getNextLine(): TextObject;
  public abstract hasChanges(): boolean;
  public abstract canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean;

  protected changed() {
    this._hasChanges = true;
    AwesomeLogger.loggerChanged(this);
  }

  public getLine(): TextObject {
    const newLine = this.getNextLine();
    return newLine;
  }

  public render(): TextObject {
    if (!this.hasChanges()) {
      return this._lastLine;
    }
    this._hasChanges = false;
    const newLine = this.getLine();

    this._lastLine = newLine;
    return newLine;
  }
}
