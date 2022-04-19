import { AwesomeLoggerBase } from '../../logger-base.js';

export interface AwesomeLoggerTextConfig {
  /**
   * The text to be logged.
   */
  text: string;
}

export interface AwesomeLoggerTextControl extends AwesomeLoggerBase {
  /**
   * Change the logged text
   * @param text The new text to be logged.
   */
  setText(text: string): void;
}
