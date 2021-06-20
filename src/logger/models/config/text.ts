import { AwesomeLoggerBase } from '../../logger-base';

export interface AwesomeLoggerTextConfig {
  text: string;
}

export interface AwesomeLoggerTextControl extends AwesomeLoggerBase {
  setText(text: string): void;
}
