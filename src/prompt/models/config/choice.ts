import { AwesomePromptBaseControl } from './base';

export interface AwesomePromptChoiceConfig {
  /**
   * The choices to display to the user.
   */
  options: string[];
  /**
   * The text to display before the choices.
   */
  text?: string;
}

export interface AwesomePromptChoiceControl extends AwesomePromptBaseControl<string> {}
