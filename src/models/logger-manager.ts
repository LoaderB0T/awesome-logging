import { MultilineLogger } from "../complex-logger/multiline-logger";

export class LoggerManager {
  private static _activeLogger?: MultilineLogger;


  public static registerLogger(logger: MultilineLogger) {
    if (this._activeLogger) {
      throw new Error('Multiline logger already running');
    }
    this._activeLogger = logger;
  }

  public static unregisterLogger() {
    this._activeLogger = undefined;
  }

  public static get activeLogger(): boolean {
    return !!this._activeLogger;
  }
}
