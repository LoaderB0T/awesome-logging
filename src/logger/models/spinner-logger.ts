import { TextObject, TextValue } from '../../models/text-object';
import { AwesomeLoggerBase } from '../models/logger-base';
import { AwesomeLoggerSpinnerConfig, AwesomeLoggerSpinnerControl } from './config/spinner';

export class AwesomeSpinnerLogger extends AwesomeLoggerBase implements AwesomeLoggerSpinnerControl {
  private readonly _options: AwesomeLoggerSpinnerConfig;
  private readonly _text: TextValue;
  private readonly _animationInterval: NodeJS.Timer;
  private _animationIndex: number = 0;
  private _stopped: boolean;
  private _cleared: boolean;
  private _succeed?: boolean;
  private _stoppedText?: string;

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

  public needsScroll() {
    return false;
  }

  public getNextLine(): TextObject {
    if (this._stopped) {
      if (this._cleared) {
        return TextObject.empty;
      }
      if (this._succeed === true) {
        return new TextObject('√', 'GREEN').append(this._stoppedText ?? this._text.text, this._text.color);
      } else if (this._succeed === false) {
        return new TextObject('X', 'RED').append(this._stoppedText ?? this._text.text, this._text.color);
      } else {
        return new TextObject(this._stoppedText ?? this._text.text, this._text.color);
      }
    }

    return new TextObject(this._options.spinnerFrames[this._animationIndex], this._options.spinnerColor).append(
      this._text.text,
      this._text.color
    );
  }

  stop(options: { succeeded?: boolean; removeLine?: boolean; text?: string }): void {
    clearInterval(this._animationInterval);
    this._stopped = true;

    if (options.removeLine) {
      this._cleared = true;
      return;
    }

    this._succeed = options.succeeded;
    this._stoppedText = options.text;

    this.changed();
  }
}
