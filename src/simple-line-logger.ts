import { LineLogger } from './line-logger';
import { TextObject } from './text-object';

export class SimpleLineLogger extends LineLogger {
  private _text: string | TextObject;

  constructor(initialText: string | TextObject) {
    super();
    this._text = initialText;
  }

  protected getNextLine(): string | TextObject {
    return this._text;
  }

  public setNextText(text: string) {
    this._text = text;
  }
}
