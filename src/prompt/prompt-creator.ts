import { AwesomeChoicePromt } from './models/choice-prompt';
import { AwesomePromptBase } from './prompt-base';
import { AwesomeTextPromt } from './models/text-prompt';
import { AwesomeTogglePromt } from './models/toggle-prompt';
import { AwesomePromptType, PromptConfig, PromptReturnType } from './prompt-type';
import { AwesomeConfirmPromt } from './models/confirm-prompt';

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
      case 'confirm': {
        prompt = new AwesomeConfirmPromt(config);
        break;
      }
      default: {
        throw new Error(`Prompt type '${type}' not found`);
      }
    }
    return prompt as PromptReturnType<T>;
  }
}
