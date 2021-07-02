import { AwesomePromptBaseControl } from './base';

export interface AwesomePromptChoiceConfig {
  options: string[];
}

export interface AwesomePromptChoiceControl extends AwesomePromptBaseControl<string> {}
