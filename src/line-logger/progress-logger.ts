import { LineLogger } from "./line-logger";
import { SimpleProgressLoggerOptions } from "../options/progress-logger-options";
import { TextObject } from "../models/text-object";
import { HIDE_CURSOR } from "../utils";

export class SimpleProgressLogger extends LineLogger {
  private _options: SimpleProgressLoggerOptions;
  private _currentProgress: number = 0;

  constructor(options: Partial<SimpleProgressLoggerOptions>) {
    super();
    this._options = {
      totalProgress: options.totalProgress ?? 100,
      text: options.text ?? '',
      completedText: options.completedText ?? '',
      unfilledChar: options.unfilledChar ?? '·',
      filledChar: options.filledChar ?? '■',
      borderChar: options.borderChar ?? '▮',
      borderColor: options.borderColor ?? 'GRAY',
      unfilledColor: options.unfilledColor ?? 'GRAY',
      filledColor: options.filledColor ?? 'WHITE',
      maxWidth: options.maxWidth ?? 999999
    };
  }

  public getNextLine(): string | TextObject | TextObject[] {
    const totalLength: number = Math.min(process.stdout.columns - 2, this._options.maxWidth);
    const finnishedLength = Math.round(this._currentProgress / this._options.totalProgress * totalLength);
    const unFinnishedLength = totalLength - finnishedLength;
    return [
      { text: this._options.borderChar, color: this._options.borderColor },
      { text: this._options.filledChar.repeat(finnishedLength), color: this._options.filledColor },
      { text: this._options.unfilledChar.repeat(unFinnishedLength), color: this._options.unfilledColor },
      { text: this._options.borderChar, color: this._options.borderColor }
    ];
  }

  public setProgress(progress: number) {
    if (progress !== this._currentProgress) {
      this._currentProgress = progress;
      this.changed();
    }
  }

}
