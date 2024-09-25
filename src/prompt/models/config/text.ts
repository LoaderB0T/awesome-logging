import { AwesomePromptBaseControl } from './base.js';
import { AwesomePromptValidator } from './validator.js';

export type AwesomePromptTextConfig = {
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
  validators: AwesomePromptValidator[];
  /**
   * The default value to use before the user has entered any input.
   */
  default: string;
};

export type AwesomePromptTextControl = AwesomePromptBaseControl<string>;
