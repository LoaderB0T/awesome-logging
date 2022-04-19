import { AwesomePromptBaseControl } from './base.js';

export interface AwesomePromptConfirmConfig {
  /**
   * The message to display to the user.
   */
  text: string;
  /**
   * The default value to use if the user doesn't provide a value.
   */
  default: 'yes' | 'no';
}

export interface AwesomePromptConfirmControl extends AwesomePromptBaseControl<boolean> {}
