import stripAnsi from 'strip-ansi';
import { colorize } from '../../utils/logger-color';
import { TerminalSize } from '../../utils/terminal-size';
import { AwesomeLoggerBase } from '../logger-base';
import { AwesomeProgressLoggerControl, AwesomeProgressLoggerConfig } from './config/progress';

export class AwesomeProgressLogger extends AwesomeLoggerBase implements AwesomeProgressLoggerControl {
  private readonly _options: AwesomeProgressLoggerConfig;
  private _currentProgress: number = 0;

  constructor(options?: Partial<AwesomeProgressLoggerConfig>) {
    super('progress');
    this._options = {
      totalProgress: options?.totalProgress ?? 100,
      text: options?.text ?? '',
      completedText: options?.completedText ?? '',
      unfilledChar: options?.unfilledChar ?? '·',
      filledChar: options?.filledChar ?? '■',
      borderChar: options?.borderChar ?? '■',
      maxWidth: options?.maxWidth ?? 999999,
      borderColor: options?.borderColor ?? 'GRAY',
      unfilledColor: options?.unfilledColor ?? 'GRAY',
      filledColor: options?.filledColor ?? 'WHITE'
    };
    if (this._options.text) {
      this._options.text += ' ';
    }
  }

  public end(): boolean {
    return true;
  }

  public needsScroll() {
    return false;
  }

  public hasChanges(): boolean {
    return this._hasChanges;
  }

  public canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean {
    return calledFrom === this;
  }

  public getNextLine(): string {
    const totalLength: number =
      Math.min(TerminalSize.terminalWidth - 2, this._options.maxWidth) - stripAnsi(this._options.text).length;
    const finnishedLength = Math.round((this._currentProgress / this._options.totalProgress) * totalLength);
    const unFinnishedLength = totalLength - finnishedLength;

    const res =
      this._options.text +
      colorize(this._options.borderColor)(this._options.borderChar) +
      colorize(this._options.filledColor)(this._options.filledChar.repeat(finnishedLength)) +
      colorize(this._options.unfilledColor)(this._options.unfilledChar.repeat(unFinnishedLength)) +
      colorize(this._options.borderColor)(this._options.borderChar);
    return res;
  }

  public setProgress(progress: number) {
    if (progress !== this._currentProgress) {
      this._currentProgress = progress;
      this.changed();
      this.restrictedChanged(this.getNextLine());
    }
  }
}
