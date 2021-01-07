import { AwesomePromptBaseControl } from './base';

export interface AwesomePromptToggleConfig {
  options: string[];
}

export interface AwesomePromptToggleControl extends AwesomePromptBaseControl<string[]> {
}
