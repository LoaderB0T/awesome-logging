import { AwesomePromptBase } from '../prompt-base';

export interface AwesomePromptTextConfig {
  text: string;
  autoComplete: string | string[];
  hasToBeFromAutoComplete: boolean;
  caseInsensitive: boolean;
  fuzzyAutoComplete: boolean;
}

export interface AwesomePromptTextControl extends AwesomePromptBase {

}
