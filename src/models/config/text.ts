import { AwesomeLoggerBase } from "../logger-base";
import { TextObject } from "../text-object";

export interface AwesomeLoggerTextConfig {
  text: string | TextObject | TextObject[];
};

export interface AwesomeLoggerTextControl extends AwesomeLoggerBase {
  setText(text: string | TextObject | TextObject[]): void;
};
