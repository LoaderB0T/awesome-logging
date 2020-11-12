import { LineLogger } from "../line-logger/line-logger";

export interface ILoggerParent {
  insertLines(lineCount: number, child: LineLogger): void;
  deleteChild(child: LineLogger): void;
  childChanged(child: LineLogger): void;
}
