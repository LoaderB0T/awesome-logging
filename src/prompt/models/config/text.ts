import { AwesomePromptBaseControl } from './base';

export interface AwesomePromptTextConfig {
  text: string;
  hints: string | string[];
  allowOnlyHints: boolean;
  caseInsensitive: boolean;
  fuzzyAutoComplete: boolean;
  validator: (val: any) => boolean | Promise<boolean>;
  default: string;
}

export interface AwesomePromptTextControl extends AwesomePromptBaseControl<string> {}
