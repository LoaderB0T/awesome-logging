import { AwesomeLoggerBase } from '../../logger-base';

export interface AwesomeLoggerSpinnerConfig {
  spinnerFrames: string[];
  text: string;
  spinnerDelay: number;
}

export interface AwesomeLoggerSpinnerControl extends AwesomeLoggerBase {
  stop(options: { succeeded?: boolean; removeLine?: boolean; text?: string }): void;
}
