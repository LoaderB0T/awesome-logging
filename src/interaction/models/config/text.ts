import { AwesomePromptBaseControl } from './base';

export interface AwesomePromptTextConfig {
  text: string;
  autoComplete: string | string[];
  hasToBeFromAutoComplete: boolean;
  caseInsensitive: boolean;
  fuzzyAutoComplete: boolean;
  validator: (val: any) => boolean | Promise<boolean>;
  default: string;
}

export interface AwesomePromptTextControl extends AwesomePromptBaseControl<string> {}
