import { LoggerColor } from "../models/logger-color";

export interface SimpleProgressLoggerOptions {
  totalProgress: number;
  text: string;
  completedText: string;
  unfilledChar: string;
  filledChar: string;
  borderChar: string;
  borderColor: LoggerColor;
  unfilledColor: LoggerColor;
  filledColor: LoggerColor;
  maxWidth: number;
}
