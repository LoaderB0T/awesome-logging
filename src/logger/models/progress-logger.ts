import { TextObject } from '../../models/text-object';
import { AwesomeLoggerBase } from '../models/logger-base';
import { AwesomeProgressLoggerControl, AwesomeProgressLoggerConfig } from './config/progress';

export class AwesomeProgressLogger extends AwesomeLoggerBase implements AwesomeProgressLoggerControl {
  private readonly _options: AwesomeProgressLoggerConfig;
  private _currentProgress: number = 0;

  public needsScroll() {
    return false;
  }

  constructor(options?: Partial<AwesomeProgressLoggerConfig>) {
    super();
    this._options = {
      totalProgress: options?.totalProgress ?? 100,
      text: options?.text ?? '',
      completedText: options?.completedText ?? '',
      unfilledChar: options?.unfilledChar ?? '·',
      filledChar: options?.filledChar ?? '■',
      borderChar: options?.borderChar ?? '▮',
      borderColor: options?.borderColor ?? 'GRAY',
      unfilledColor: options?.unfilledColor ?? 'GRAY',
      filledColor: options?.filledColor ?? 'WHITE',
      maxWidth: options?.maxWidth ?? 999999
    };
  }

  public hasChanges(): boolean {
    return this._hasChanges;
  }

  public canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean {
    return calledFrom === this;
  }

  public getNextLine(): TextObject {
    const totalLength: number = Math.min(process.stdout.columns - 2, this._options.maxWidth);
    const finnishedLength = Math.round(this._currentProgress / this._options.totalProgress * totalLength);
    const unFinnishedLength = totalLength - finnishedLength;
    return new TextObject(this._options.borderChar, this._options.borderColor)
      .append(this._options.filledChar.repeat(finnishedLength), this._options.filledColor)
      .append(this._options.unfilledChar.repeat(unFinnishedLength), this._options.unfilledColor)
      .append(this._options.borderChar, this._options.borderColor);
  }

  public setProgress(progress: number) {
    if (progress !== this._currentProgress) {
      this._currentProgress = progress;
      this.changed();
    }
  }

}
