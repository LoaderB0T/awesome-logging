import chalk from 'chalk';
import { AwesomeLoggerBase } from '../logger-base';
import { AwesomeLoggerSpinnerConfig, AwesomeLoggerSpinnerControl } from './config/spinner';

export class AwesomeSpinnerLogger extends AwesomeLoggerBase implements AwesomeLoggerSpinnerControl {
  private readonly _options: AwesomeLoggerSpinnerConfig;
  private readonly _text: string;
  private readonly _animationInterval?: NodeJS.Timer;
  private _animationIndex: number = 0;
  private _stopped: boolean = false;
  private _cleared: boolean = false;
  private _succeed?: boolean;
  private _stoppedText?: string;

  constructor(options?: Partial<AwesomeLoggerSpinnerConfig>) {
    super();
    this._text = options?.text ?? '';
    this._options = {
      text: '',
      spinnerFrames: options?.spinnerFrames ?? ['.  ', '.. ', '...', '.. '],
      spinnerDelay: options?.spinnerDelay ?? 500
    };
    this._animationInterval = setInterval(() => {
      this._animationIndex++;
      if (this._animationIndex >= this._options.spinnerFrames.length) {
        this._animationIndex = 0;
      }
      this.changed();
    }, this._options.spinnerDelay);
  }

  public end(): boolean {
    if (this._animationInterval) {
      clearInterval(this._animationInterval);
    }
    this._stopped = true;
    return true;
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

  public getNextLine(): string {
    if (this._stopped) {
      if (this._cleared) {
        return '';
      }
      if (this._succeed === true) {
        return chalk.green('√ ') + this._stoppedText ?? this._text;
      } else if (this._succeed === false) {
        return chalk.red('X ') + this._stoppedText ?? this._text;
      } else {
        return this._stoppedText ?? this._text;
      }
    }

    return `${this._options.spinnerFrames[this._animationIndex]} ${this._text}`;
  }

  stop(options: { succeeded?: boolean; removeLine?: boolean; text?: string }): void {
    this.end();

    if (options.removeLine) {
      this._cleared = true;
      return;
    }

    this._succeed = options.succeeded;
    this._stoppedText = options.text;

    this.changed();
    this.restrictedChanged(this.getNextLine());
  }
}
