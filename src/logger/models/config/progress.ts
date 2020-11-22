import { TextObject } from '../../../models/text-object';
import { AwesomeLoggerColor } from '../../../types/logger-color';
import { AwesomeLoggerBase } from '../logger-base';


export interface AwesomeLoggerProgressConfig {
  totalProgress: number;
  text: string | TextObject | TextObject[];
  completedText: string | TextObject | TextObject[];
  unfilledChar: string;
  filledChar: string;
  borderChar: string;
  maxWidth: number;
  borderColor: AwesomeLoggerColor;
  unfilledColor: AwesomeLoggerColor;
  filledColor: AwesomeLoggerColor;
}

export interface AwesomeLoggerProgressControl extends AwesomeLoggerBase {
  setProgress(progress: number, text?: string | TextObject | TextObject[]): void;
}
