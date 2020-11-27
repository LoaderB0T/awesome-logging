import { TextObject, TextValue } from '../../../models/text-object';
import { AwesomeLoggerColor } from '../../../types/logger-color';
import { AwesomeLoggerBase } from '../logger-base';


export interface AwesomeLoggerSpinnerConfig {
  spinnerFrames: string[];
  text: string | TextValue;
  spinnerDelay: number,
  spinnerColor: AwesomeLoggerColor
}

export interface AwesomeLoggerSpinnerControl extends AwesomeLoggerBase {
  setProgress(progress: number, text?: string | TextValue | TextObject): void;
}
