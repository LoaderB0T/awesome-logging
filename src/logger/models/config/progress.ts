import { AwesomeLoggerColor } from '../../../utils/logger-color';
import { AwesomeLoggerBase } from '../../logger-base';

export interface AwesomeProgressLoggerConfig {
  /**
   * The max value of the progress bar.
   */
  totalProgress: number;
  /**
   * The text displayed infront of the progress bar.
   */
  text: string;
  /**
   * The text displayed when the progress bar is full.
   */
  completedText: string;
  /**
   * The character used to represent the unfilled progress bar.
   */
  unfilledChar: string;
  /**
   * The character used to represent the filled progress bar.
   */
  filledChar: string;
  /**
   * The character used to mark the beginning and end of the progress bar.
   */
  borderChar: string;
  /**
   * The maximum length of the progress bar.
   */
  maxWidth: number;
  /**
   * The color of the borderChars.
   */
  borderColor: AwesomeLoggerColor;
  /**
   * The color of the unfilled progress bar.
   */
  unfilledColor: AwesomeLoggerColor;
  /**
   * The color of the filled progress bar.
   */
  filledColor: AwesomeLoggerColor;
}

export interface AwesomeProgressLoggerControl extends AwesomeLoggerBase {
  /**
   * Sets the progress bar to a specific value.
   * @param progress The new progress value.
   * @param text (optional) The new text displayed infront of the progress bar.
   */
  setProgress(progress: number, text?: string): void;
}
