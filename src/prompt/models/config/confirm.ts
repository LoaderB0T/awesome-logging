import { AwesomePromptBaseControl } from './base';

export interface AwesomePromptConfirmConfig {
  text: string;
  default: 'yes' | 'no';
}

export interface AwesomePromptConfirmControl extends AwesomePromptBaseControl<boolean> {}
