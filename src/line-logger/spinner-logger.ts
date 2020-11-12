import { LineLogger } from "./line-logger";
import { TextObject } from "../models/text-object";
import { SimpleSpinnerLoggerOptions } from "../options/progress-spinner-options";
import { SimpleSpinnerCompleteOptions } from "../options/progress-spinner-complete-options";

export class SimpleSpinnerLogger extends LineLogger {
  private _options: SimpleSpinnerLoggerOptions;
  private _animationIndex: number = 0;
  private _animationInterval: NodeJS.Timer;

  constructor(options: Partial<SimpleSpinnerLoggerOptions>) {
    super();
    this._options = {
      text: options.text ?? '',
      spinnerFrames: options.spinnerFrames ?? ['.  ', '.. ', '...', '.. '],
      spinnerDelay: options.spinnerDelay ?? 500,
      spinnerColor: options.spinnerColor ?? "WHITE"
    };
    this._animationInterval = setInterval(() => {
      this._animationIndex++;
      if (this._animationIndex >= this._options.spinnerFrames.length) {
        this._animationIndex = 0;
      }
      this.changed();
    }, this._options.spinnerDelay);
  }

  public getNextLine(): string | TextObject | TextObject[] {
    return [
      { text: this._options.spinnerFrames[this._animationIndex], color: this._options.spinnerColor },
      ...TextObject.ensureArray(this._options.text)
    ];
  }

  public complete(options: SimpleSpinnerCompleteOptions) {
    clearInterval(this._animationInterval);
    this.changed();
  }

}
