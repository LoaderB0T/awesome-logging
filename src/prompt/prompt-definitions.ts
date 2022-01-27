import { AwesomePromptChoiceConfig, AwesomePromptChoiceControl } from './models/config/choice';
import { AwesomePromptConfirmConfig, AwesomePromptConfirmControl } from './models/config/confirm';
import { AwesomePromptTextConfig, AwesomePromptTextControl } from './models/config/text';
import { AwesomePromptToggleConfig, AwesomePromptToggleControl } from './models/config/toggle';

export type AwesomePromptDefinitions =
  | { type: 'text'; config: AwesomePromptTextConfig; returnValue: AwesomePromptTextControl }
  | { type: 'toggle'; config: AwesomePromptToggleConfig; returnValue: AwesomePromptToggleControl }
  | { type: 'choice'; config: AwesomePromptChoiceConfig; returnValue: AwesomePromptChoiceControl }
  | { type: 'confirm'; config: AwesomePromptConfirmConfig; returnValue: AwesomePromptConfirmControl };
