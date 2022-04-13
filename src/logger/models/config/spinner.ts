import { AwesomeLoggerBase } from '../../logger-base';

export interface AwesomeLoggerSpinnerConfig {
  /**
   * An array of strings to be used as the spinner.
   */
  spinnerFrames: string[];
  /**
   * The text to be displayed after the spinner.
   */
  text: string;
  /**
   * The delay between spinnerFrames in milliseconds.
   */
  spinnerDelay: number;
}

export interface AwesomeLoggerSpinnerControl extends AwesomeLoggerBase {
  /**
   * Stop the spinner.
   * @param options Options to be used when stopping the spinner.
   */
  stop(options: {
    /**
     * Set whether or not the spinner should indicate success.
     */
    succeeded?: boolean;
    /**
     * Set whether or not the spinner should remove the logged text
     */
    removeLine?: boolean;
    /**
     * Set new text to be displayed after the spinner.
     */
    text?: string;
  }): void;
}
