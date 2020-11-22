import { TextObject } from '../../../models/text-object';
import { AwesomeLoggerColor } from '../../../types/logger-color';
import { AwesomeLoggerBase } from '../logger-base';


export interface AwesomeLoggerSpinnerConfig {
  spinnerFrames: string[];
  text: string | TextObject | TextObject[];
  spinnerDelay: number,
  spinnerColor: AwesomeLoggerColor
}

export interface AwesomeLoggerSpinnerControl extends AwesomeLoggerBase {
  setProgress(progress: number, text?: string | TextObject | TextObject[]): void;
}
