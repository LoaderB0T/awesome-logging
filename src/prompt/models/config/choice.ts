import { AwesomePromptBaseControl } from './base';

export interface AwesomePromptChoiceConfig {
  options: string[];
  text?: string;
}

export interface AwesomePromptChoiceControl extends AwesomePromptBaseControl<string> {}
