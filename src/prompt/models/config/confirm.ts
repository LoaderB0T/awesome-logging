import { AwesomePromptBaseControl } from './base';

export interface AwesomePromptConfirmConfig {
  text: string;
}

export interface AwesomePromptConfirmControl extends AwesomePromptBaseControl<boolean> {}
