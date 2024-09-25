import { AwesomePromptBaseControl } from './base.js';

export type AwesomePromptChoiceConfig = {
  /**
   * The choices to display to the user.
   */
  options: string[];
  /**
   * The text to display before the choices.
   */
  text?: string;
};

export type AwesomePromptChoiceControl = AwesomePromptBaseControl<string>;
