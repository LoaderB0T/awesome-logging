import { TextObject } from "../models/text-object";

export interface SimpleSpinnerCompleteOptions {
  deleteLine?: boolean;
  prefix?: string | TextObject;
  text?: string | TextObject | TextObject[];
}
