import { AwesomePromptChoiceConfig, AwesomePromptChoiceControl } from './models/config/choice.js';
import { AwesomePromptConfirmConfig, AwesomePromptConfirmControl } from './models/config/confirm.js';
import { AwesomePromptTextConfig, AwesomePromptTextControl } from './models/config/text.js';
import { AwesomePromptToggleConfig, AwesomePromptToggleControl } from './models/config/toggle.js';

export type AwesomePromptDefinitions =
  | { type: 'text'; config: AwesomePromptTextConfig; returnValue: AwesomePromptTextControl }
  | { type: 'toggle'; config: AwesomePromptToggleConfig; returnValue: AwesomePromptToggleControl }
  | { type: 'choice'; config: AwesomePromptChoiceConfig; returnValue: AwesomePromptChoiceControl }
  | { type: 'confirm'; config: AwesomePromptConfirmConfig; returnValue: AwesomePromptConfirmControl };
