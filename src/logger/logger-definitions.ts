import { AwesomeChecklistLoggerConfig, AwesomeChecklistLoggerControl } from './models/config/checklist.js';
import { AwesomeLoggerMultiConfig, AwesomeLoggerMultiControl } from './models/config/multi.js';
import { AwesomeProgressLoggerConfig, AwesomeProgressLoggerControl } from './models/config/progress.js';
import { AwesomeLoggerSpinnerConfig, AwesomeLoggerSpinnerControl } from './models/config/spinner.js';
import { AwesomeLoggerTextConfig, AwesomeLoggerTextControl } from './models/config/text.js';

export type AwesomeLoggerDefinitions =
  | { type: 'text'; config: AwesomeLoggerTextConfig; returnValue: AwesomeLoggerTextControl }
  | { type: 'progress'; config: AwesomeProgressLoggerConfig; returnValue: AwesomeProgressLoggerControl }
  | { type: 'spinner'; config: AwesomeLoggerSpinnerConfig; returnValue: AwesomeLoggerSpinnerControl }
  | { type: 'multi'; config: AwesomeLoggerMultiConfig; returnValue: AwesomeLoggerMultiControl }
  | { type: 'checklist'; config: AwesomeChecklistLoggerConfig; returnValue: AwesomeChecklistLoggerControl };
