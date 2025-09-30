import { AwesomePromptBaseControl } from './base.js';

export type AwesomePromptToggleConfig = {
  /**
   * The label to display for the toggle.
   */
  text?: string;
  /**
   * A list of options to display in the toggle.
   */
  options: string[];
  /**
   * A list of default selected options.
   */
  default: string[];
};

export type AwesomePromptToggleControl = AwesomePromptBaseControl<string[]>;
