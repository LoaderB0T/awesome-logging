import { TextObject, TextValue } from '../../models/text-object';
import { AwesomeLoggerBase } from '../models/logger-base';
import { AwesomeLoggerTextConfig, AwesomeLoggerTextControl } from './config/text';

export class AwesomeTextLogger extends AwesomeLoggerBase implements AwesomeLoggerTextControl {
  private _text: TextObject;

  constructor(config?: Partial<AwesomeLoggerTextConfig>) {
    super();
    this._text = config?.text ? TextObject.create(config.text) : new TextObject('');
  }

  public hasChanges(): boolean {
    return this._hasChanges;
  }

  public needsScroll() {
    return false;
  }

  public canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean {
    return calledFrom === this;
  }

  getNextLine(): TextObject {
    return this._text;
  }

  public setText(text: string | TextValue | TextObject) {
    if (text !== this._text) {
      this._text = TextObject.create(text);
      this.changed();
    }
  }
}
