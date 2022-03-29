import { AwesomePromptBaseControl } from './base';

export interface AwesomePromptToggleConfig {
  text?: string;
  options: string[];
}

export interface AwesomePromptToggleControl extends AwesomePromptBaseControl<string[]> {}
