import { TextObject, TextValue } from '../../../models/text-object';
import { AwesomeLoggerColor } from '../../../types/logger-color';
import { AwesomeLoggerBase } from '../logger-base';

export interface AwesomeProgressLoggerConfig {
  totalProgress: number;
  text: string | TextValue;
  completedText: string | TextValue;
  unfilledChar: string;
  filledChar: string;
  borderChar: string;
  maxWidth: number;
  borderColor: AwesomeLoggerColor;
  unfilledColor: AwesomeLoggerColor;
  filledColor: AwesomeLoggerColor;
}

export interface AwesomeProgressLoggerControl extends AwesomeLoggerBase {
  setProgress(progress: number, text?: string | TextValue | TextObject): void;
}
