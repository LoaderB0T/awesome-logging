import { AwesomeLoggerSpinnerConfig } from "../models/config/spinner";
import { AwesomeLoggerBase } from "../models/logger-base";
import { TextObject } from "../models/text-object";

export class AwesomeSpinnerLogger extends AwesomeLoggerBase {
  private _options: AwesomeLoggerSpinnerConfig;
  private _animationIndex: number = 0;
  private _animationInterval: NodeJS.Timer;

  constructor(options: Partial<AwesomeLoggerSpinnerConfig>) {
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

  public hasChanges(): boolean {
    return this._hasChanges;
  }

  public getNextLine(): string | TextObject | TextObject[] {
    return [
      { text: this._options.spinnerFrames[this._animationIndex], color: this._options.spinnerColor },
      ...TextObject.ensureArray(this._options.text)
    ];
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
