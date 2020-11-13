import { AwesomeLoggerMultiConfig, AwesomeLoggerMultiControl } from '../models/config/multi';
import { AwesomeLoggerProgressConfig, AwesomeLoggerProgressControl } from '../models/config/progress';
import { AwesomeLoggerSpinnerConfig, AwesomeLoggerSpinnerControl } from '../models/config/spinner';
import { AwesomeLoggerTextConfig, AwesomeLoggerTextControl } from '../models/config/text';

export type AwesomeLoggerDefinitions =
  { type: 'text', config: AwesomeLoggerTextConfig, returnValue: AwesomeLoggerTextControl } |
  { type: 'progress', config: AwesomeLoggerProgressConfig, returnValue: AwesomeLoggerProgressControl } |
  { type: 'spinner', config: AwesomeLoggerSpinnerConfig, returnValue: AwesomeLoggerSpinnerControl } |
  { type: 'multi', config: AwesomeLoggerMultiConfig, returnValue: AwesomeLoggerMultiControl };
