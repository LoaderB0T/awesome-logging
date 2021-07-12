import { AwesomeLoggerBase } from '../logger-base';
import { AwesomeLoggerTextConfig, AwesomeLoggerTextControl } from './config/text';

export class AwesomeTextLogger extends AwesomeLoggerBase implements AwesomeLoggerTextControl {
  private _text: string;

  constructor(config?: Partial<AwesomeLoggerTextConfig>) {
    super();
    this._text = config?.text ?? '';
  }

  public hasChanges(): boolean {
    return this._hasChanges;
  }

  public needsScroll() {
    return false;
  }

  public end() {
    return true;
  }

  public canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean {
    return calledFrom === this;
  }

  getNextLine(): string {
    return this._text;
  }

  public setText(text: string) {
    if (text !== this._text) {
      this._text = text;
      this.changed();
      this.restrictedChanged(text);
    }
  }
}
