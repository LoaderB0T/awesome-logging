import { AwesomePromptBaseControl } from './base.js';

export type AwesomePromptConfirmConfig = {
  /**
   * The message to display to the user.
   */
  text: string;
  /**
   * The default value to use if the user doesn't provide a value.
   */
  default: 'yes' | 'no';
};

export type AwesomePromptConfirmControl = AwesomePromptBaseControl<boolean>;
