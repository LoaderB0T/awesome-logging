import { AwesomePromptBaseControl } from './base.js';

export interface AwesomePromptTextConfig {
  /**
   * The text to display in the prompt.
   */
  text: string;
  /**
   * Hints for auto-completion.
   */
  hints: string | string[];
  /**
   * Restrict the input to one of the given hints.
   */
  allowOnlyHints: boolean;
  /**
   * Auto-completion is case-insensitive.
   */
  caseInsensitive: boolean;
  /**
   * Enable fuzzy auto-completion
   */
  fuzzyAutoComplete: boolean;
  /**
   * A validatior callback to check whether the input is valid.
   */
  validator: (val: any) => boolean | Promise<boolean>;
  /**
   * The default value to use before the user has entered any input.
   */
  default: string;
}

export interface AwesomePromptTextControl extends AwesomePromptBaseControl<string> {}
