import { AwesomeChecklistLoggerConfig, AwesomeChecklistLoggerControl } from './models/config/checklist';
import { AwesomeLoggerMultiConfig, AwesomeLoggerMultiControl } from './models/config/multi';
import { AwesomeProgressLoggerConfig, AwesomeProgressLoggerControl } from './models/config/progress';
import { AwesomeLoggerSpinnerConfig, AwesomeLoggerSpinnerControl } from './models/config/spinner';
import { AwesomeLoggerTextConfig, AwesomeLoggerTextControl } from './models/config/text';

export type AwesomeLoggerDefinitions =
  | { type: 'text'; config: AwesomeLoggerTextConfig; returnValue: AwesomeLoggerTextControl }
  | { type: 'progress'; config: AwesomeProgressLoggerConfig; returnValue: AwesomeProgressLoggerControl }
  | { type: 'spinner'; config: AwesomeLoggerSpinnerConfig; returnValue: AwesomeLoggerSpinnerControl }
  | { type: 'multi'; config: AwesomeLoggerMultiConfig; returnValue: AwesomeLoggerMultiControl }
  | { type: 'checklist'; config: AwesomeChecklistLoggerConfig; returnValue: AwesomeChecklistLoggerControl };
