import { AwesomeLogger } from '../awesome-logger.js';
import { LoggerManager } from './logger-manager.js';

export abstract class AwesomeLoggerBase {
  public static isInitialized = false;

  private _lastLine: string = '';
  // @internal
  public scrollAmount: number = 0;
  // @internal
  public type: string;
  protected _hasChanges: boolean = true;
  public fixedLineCount: number = 0;
  private _clean: boolean = false;

  constructor(type: string) {
    this.type = type;
  }

  // @internal
  public internalEnd(): void {
    if (this.end() && this._lastLine) {
      this._clean = true;
      this.changed();
      LoggerManager.getInstance().logEndOfLastLogger(this.render());
    }
  }

  public abstract end(): boolean;
  // @internal
  public abstract getNextLine(): string;
  // @internal
  public abstract hasChanges(): boolean;
  // @internal
  public abstract canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean;
  // @internal
  public abstract needsScroll(): boolean;

  protected changed() {
    if (AwesomeLogger.restrictedLogging) {
      return;
    }
    this._hasChanges = true;
    LoggerManager.getInstance().loggerChanged(this);
  }

  protected restrictedChanged(text: string) {
    if (!AwesomeLogger.restrictedLogging) {
      return;
    }
    this._hasChanges = true;
    LoggerManager.getInstance().logRestricted(text);
  }

  // @internal
  public render(): string {
    if (this._clean) {
      this._clean = false;
      this._lastLine = '';
      return '';
    }
    if (!this.hasChanges()) {
      return this._lastLine;
    }
    this._hasChanges = false;
    const newLine = this.getNextLine();

    this._lastLine = newLine;
    return newLine;
  }

  // @internal
  public clean(): void {
    if (!this._lastLine) {
      return;
    }
    this._clean = true;
    this.changed();
  }
}
