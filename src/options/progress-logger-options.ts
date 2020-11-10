import { LoggerColor } from "../logger-color";

export interface ProgressLoggerOptions {
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
