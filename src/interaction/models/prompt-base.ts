import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeLoggerBase } from '../../logger/models/logger-base';
import { AwesomeMultiLogger } from '../../logger/models/multi-logger';
import { TextObject } from '../../models/text-object';


export abstract class AwesomePromptBase<T> extends AwesomeLoggerBase {
  protected _hasChanges: boolean = true;
  private _readStream: NodeJS.ReadStream;
  private _promptFinished: (value: T | PromiseLike<T>) => void;
  private _promptCancelled: (value: T | PromiseLike<T>) => void;
  public readonly result: Promise<T>;

  constructor(prompt: AwesomeLoggerBase[]) {
    super();
    this.multiLogger = AwesomeLogger.create('multi', { children: prompt }) as AwesomeMultiLogger;
    this.result = new Promise<T>((resolve, reject) => {
      this._promptFinished = resolve;
      this._promptCancelled = reject;
    });
  }

  public multiLogger: AwesomeMultiLogger;

  public getNextLine(): TextObject {
    return this.multiLogger.getNextLine();
  }

  public hasChanges(): boolean {
    return this.multiLogger.hasChanges();
  }

  public canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean {
    return this.multiLogger.canBeCalledFrom(calledFrom);
  }

  public needsScroll() {
    return true;
  }

  protected changed() {
    this._hasChanges = true;
    AwesomeLogger.loggerChanged(this.multiLogger);
  }

  public render(): TextObject {
    return this.multiLogger.render();
  }

  public abstract init(): void;

  protected abstract gotKey(key: string): void;

  protected inputFinished(result: T) {
    this._readStream.destroy();
    this._promptFinished(result);
    this.multiLogger['_children'].splice(0, this.multiLogger['_children'].length - 1);
    this.resetViewAndShowResult();
  }

  protected abstract resetViewAndShowResult(): void;

  public waitForUserInput() {
    const stdin = process.stdin;
    // without this, we would only get streams once enter is pressed
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    this._readStream = stdin.on('data', (key) => {
      // ctrl-c ( end of text )
      if (key.toString() === '\u0003') {
        process.exit();
      }
      this.gotKey(key.toString());
    });
  }
}
