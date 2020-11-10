import { LineLogger } from './line-logger';
import { TextObject } from './text-object';

export class SimpleLineLogger extends LineLogger {
  private _text: string | TextObject;

  constructor(initialText: string | TextObject) {
    super();
    this._text = initialText;
  }

  protected getNextLine(): string | TextObject {
    this._hasChanges = false;
    return this._text;
  }

  public setNextText(text: string | TextObject) {
    if (text !== this._text) {
      this._hasChanges = true;
      this._text = text;
    }
  }

}
