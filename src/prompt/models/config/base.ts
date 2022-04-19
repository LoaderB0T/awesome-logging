import { AwesomePromptBase } from '../../prompt-base.js';

export interface AwesomePromptBaseControl<T> extends AwesomePromptBase<T> {
  /**
   * The result of the prompt. (async)
   */
  result: Promise<T>;
}
