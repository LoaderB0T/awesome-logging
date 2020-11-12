import { LoggerColor } from "../models/logger-color";
import { TextObject } from "../models/text-object";

export interface SimpleSpinnerLoggerOptions {
  spinnerFrames: string[];
  text: string | TextObject | TextObject[];
  spinnerDelay: number,
  spinnerColor: LoggerColor
}
