import { TextObject } from '../../../models/text-object';
import { AwesomeLoggerBase } from '../logger-base';

export interface AwesomeLoggerTextConfig {
  text: string | TextObject | TextObject[];
}

export interface AwesomeLoggerTextControl extends AwesomeLoggerBase {
  setText(text: string | TextObject | TextObject[]): void;
}
