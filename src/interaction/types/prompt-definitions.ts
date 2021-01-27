import { AwesomePromptTextConfig, AwesomePromptTextControl } from '../models/config/text';
import { AwesomePromptToggleConfig, AwesomePromptToggleControl } from '../models/config/toggle';

export type AwesomePromptDefinitions =
  | { type: 'text'; config: AwesomePromptTextConfig; returnValue: AwesomePromptTextControl }
  | { type: 'toggle'; config: AwesomePromptToggleConfig; returnValue: AwesomePromptToggleControl };
