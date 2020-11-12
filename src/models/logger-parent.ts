import { LineLogger } from "../line-logger/line-logger";

export interface ILoggerParent {
  childChanged(child: LineLogger): void;
}
