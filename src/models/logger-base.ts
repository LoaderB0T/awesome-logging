import { AwesomeLogger } from "../awesome-logger";
import { TextObject } from "./text-object";

export abstract class AwesomeLoggerBase {

  private _lastLine: string | TextObject | TextObject[];
  protected _hasChanges: boolean = true;

  constructor() {
    this._lastLine = '';
  }

  public abstract getNextLine(): string | TextObject | TextObject[];
  public abstract hasChanges(): boolean;

  protected changed() {
    this._hasChanges = true;
    AwesomeLogger['loggerChanged']();
  }

  public getLine(): string | TextObject | TextObject[] {
    let newLine = this.getNextLine();
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
