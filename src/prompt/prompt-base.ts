import { AwesomeLogger } from '../awesome-logger.js';
import { AwesomeLoggerBase } from '../logger/logger-base.js';
import { LoggerManager } from '../logger/logger-manager.js';

export abstract class AwesomePromptBase<T> extends AwesomeLoggerBase {
  private _promptFinished!: (value: T | Promise<T>) => void;
  private _promptCancelled!: (value: T | Promise<T>) => void;
  private _logger: AwesomeLoggerBase;
  public readonly result: Promise<T>;

  constructor(initialPromptLogger: AwesomeLoggerBase) {
    if (AwesomeLogger.restrictedLogging) {
      throw new Error('Prompts cannot be used when restricted logging is enabled');
    }
    super('prompt');
    this._logger = initialPromptLogger;
    this.result = new Promise<T>((resolve, reject) => {
      this._promptFinished = resolve;
      this._promptCancelled = reject;
    });
  }

  public end(): boolean {
    throw new Error('prompts cannot be ended at the moment');
  }

  public getNextLine(): string {
    return this._logger.getNextLine();
  }

  public hasChanges(): boolean {
    return this._logger.hasChanges();
  }

  public canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean {
    return this === calledFrom || this._logger.canBeCalledFrom(calledFrom);
  }

  protected abstract prepareResultLogger(): void;
  public abstract gotKey(key: string): void;
  public abstract init(): void;
  public abstract getCurrentAnswer(): T | undefined;

  protected setLogger(logger: AwesomeLoggerBase) {
    this._logger = logger;
  }

  protected inputFinished(result: T) {
    LoggerManager.getInstance().changeKeyListener(null);
    this.prepareResultLogger();
    this.changed();
    LoggerManager.getInstance().clearLogger();
    this._promptFinished(result);
  }
}
