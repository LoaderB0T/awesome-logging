import { TextObject, TextValue } from '../../../models/text-object';
import { AwesomeLoggerBase } from '../logger-base';

export interface AwesomeLoggerTextConfig {
  text: string | TextValue | TextObject;
}

export interface AwesomeLoggerTextControl extends AwesomeLoggerBase {
  setText(text: string | TextValue | TextObject): void;
}
