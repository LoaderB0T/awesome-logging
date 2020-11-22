import { AwesomeLogger } from '../../awesome-logger';
import { TextObject } from '../../models/text-object';

export abstract class AwesomeLoggerBase {

  private _lastLine: string | TextObject | TextObject[];
  protected _hasChanges: boolean = true;

  constructor() {
    this._lastLine = '';
  }

  public abstract getNextLine(): string | TextObject | TextObject[];
  public abstract hasChanges(): boolean;
  public abstract canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean;

  protected changed() {
    this._hasChanges = true;
    AwesomeLogger.loggerChanged(this);
  }

  public getLine(): string | TextObject | TextObject[] {
    const newLine = this.getNextLine();
    return newLine;
  }

  public render(): string | undefined {
    if (!this.hasChanges()) {
      return TextObject.ensureString(this._lastLine);
    }
    this._hasChanges = false;
    const newLine = this.getLine();
    this._lastLine = newLine;
    const newString = TextObject.ensureString(newLine);
    return newString;
  }
}
