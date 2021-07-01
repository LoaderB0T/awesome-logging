import { AwesomePromptBase } from '../prompt-base';

export interface AwesomePromptBaseControl<T> extends AwesomePromptBase<T> {
  result: Promise<T>;
}
