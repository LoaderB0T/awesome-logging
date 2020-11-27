import { TextObject, TextValue } from '../../models/text-object';
import { AwesomeLoggerBase } from '../models/logger-base';
import { AwesomeLoggerSpinnerConfig } from './config/spinner';

export class AwesomeSpinnerLogger extends AwesomeLoggerBase {
  private readonly _options: AwesomeLoggerSpinnerConfig;
  private readonly _text: TextValue;
  private readonly _animationInterval: NodeJS.Timer;
  private _animationIndex: number = 0;

  constructor(options?: Partial<AwesomeLoggerSpinnerConfig>) {
    super();
    this._text = options?.text ? TextObject.ensureTextValue(options.text) : { text: '' };
    this._options = {
      text: '',
      spinnerFrames: options?.spinnerFrames ?? ['.  ', '.. ', '...', '.. '],
      spinnerDelay: options?.spinnerDelay ?? 500,
      spinnerColor: options?.spinnerColor ?? 'WHITE'
    };
    this._animationInterval = setInterval(() => {
      this._animationIndex++;
      if (this._animationIndex >= this._options.spinnerFrames.length) {
        this._animationIndex = 0;
      }
      this.changed();
    }, this._options.spinnerDelay);
  }

  public hasChanges(): boolean {
    return this._hasChanges;
  }

  public canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean {
    return calledFrom === this;
  }

  public getNextLine(): TextObject {
    return new TextObject(this._options.spinnerFrames[this._animationIndex], this._options.spinnerColor)
      .append(this._text.text, this._text.color);
  }

  public complete(options: any) {
    clearInterval(this._animationInterval);
    if (options.deleteLine) {
      // this.delete();
    } else {
      this.changed();
    }
  }

}
