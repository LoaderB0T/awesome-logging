import { LoggerManager } from './logger-manager';

export abstract class AwesomeLoggerBase {
  public static isInitialized = false;

  private _lastLine: string = '';
  public scrollAmount: number = 0;
  protected _hasChanges: boolean = true;

  constructor() {}

  public abstract getNextLine(): string;
  public abstract hasChanges(): boolean;
  public abstract canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean;
  public abstract needsScroll(): boolean;

  protected changed() {
    this._hasChanges = true;
    LoggerManager.getInstance().loggerChanged(this);
  }

  public render(): string {
    if (!this.hasChanges()) {
      return this._lastLine;
    }
    this._hasChanges = false;
    const newLine = this.getNextLine();

    this._lastLine = newLine;
    return newLine;
  }

  // public clean(): void {
  //   if (!this._lastLine) {
  //     return;
  //   }

  //   const visibleLines = AwesomeLogger.visibleLineCount(this._lastLine.allLines() ?? []);
  //   for (let i = 0; i < visibleLines; i++) {
  //     DELETE_LINE();
  //     MOVE_UP(1);
  //   }
  // }
}
