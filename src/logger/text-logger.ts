import { TextObject } from '../models/text-object';
import { AwesomeLoggerTextConfig, AwesomeLoggerTextControl } from '../models/config/text';
import { AwesomeLoggerBase } from '../models/logger-base';

export class AwesomeTextLogger extends AwesomeLoggerBase implements AwesomeLoggerTextControl {
  private _text: string | TextObject | TextObject[];

  constructor(config: Partial<AwesomeLoggerTextConfig>) {
    super();
    this._text = config.text ?? '';
  }

  public hasChanges(): boolean {
    return this._hasChanges;
  }

  getNextLine(): string | TextObject | TextObject[] {
    return this._text;
  }

  public setText(text: string | TextObject | TextObject[]) {
    if (text !== this._text) {
      this._text = text;
      this.changed();
    }
  }

}
