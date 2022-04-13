import { AwesomePromptBaseControl } from './base';

export interface AwesomePromptToggleConfig {
  /**
   * The label to display for the toggle.
   */
  text?: string;
  /**
   * A list of options to display in the toggle.
   */
  options: string[];
}

export interface AwesomePromptToggleControl extends AwesomePromptBaseControl<string[]> {}
