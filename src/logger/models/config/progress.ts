import { AwesomeLoggerColor } from '../../../utils/logger-color';
import { AwesomeLoggerBase } from '../../logger-base';

export interface AwesomeProgressLoggerConfig {
  totalProgress: number;
  text: string;
  completedText: string;
  unfilledChar: string;
  filledChar: string;
  borderChar: string;
  maxWidth: number;
  borderColor: AwesomeLoggerColor;
  unfilledColor: AwesomeLoggerColor;
  filledColor: AwesomeLoggerColor;
}

export interface AwesomeProgressLoggerControl extends AwesomeLoggerBase {
  setProgress(progress: number, text?: string): void;
}
