import { AwesomeChoicePromt } from './models/choice-prompt';
import { AwesomePromptBase } from './prompt-base';
import { AwesomeTextPromt } from './models/text-prompt';
import { AwesomeTogglePromt } from './models/toggle-prompt';
import { AwesomePromptType, PromptConfig, PromptReturnType } from './prompt-type';

export class PromptCreator {
  public static create<T extends AwesomePromptType>(type: T, config: PromptConfig<T>): PromptReturnType<T> {
    let prompt: AwesomePromptBase<any> | undefined = undefined;

    switch (type) {
      case 'text': {
        prompt = new AwesomeTextPromt(config);
        break;
      }
      case 'toggle': {
        prompt = new AwesomeTogglePromt(config);
        break;
      }
      case 'choice': {
        prompt = new AwesomeChoicePromt(config);
        break;
      }
    }

    if (!prompt) {
      throw new Error(`Logger type '${type}' not found`);
    }
    return prompt as PromptReturnType<T>;
  }
}
