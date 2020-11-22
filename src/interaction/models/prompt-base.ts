import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeLoggerMultiControl } from '../../logger/models/config/multi';
import { AwesomeLoggerBase } from '../../logger/models/logger-base';
import { TextObject } from '../../models/text-object';
import { SHOW_CURSOR } from '../../utils/ansi-utils';


export abstract class AwesomePromptBase extends AwesomeLoggerBase {
  protected _hasChanges: boolean = true;
  private _readStream: NodeJS.ReadStream;

  constructor(prompt: AwesomeLoggerBase[]) {
    super();
    this.multiLogger = AwesomeLogger.create('multi', { children: prompt });
  }

  public multiLogger: AwesomeLoggerMultiControl;

  public getNextLine(): string | TextObject | TextObject[] {
    return this.multiLogger.getNextLine();
  }

  public hasChanges(): boolean {
    return this.multiLogger.hasChanges();
  }

  public canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean {
    return this.multiLogger.canBeCalledFrom(calledFrom);
  }

  protected changed() {
    this._hasChanges = true;
    AwesomeLogger.loggerChanged(this.multiLogger);
  }

  public getLine(): string | TextObject | TextObject[] {
    const newLine = this.getNextLine();
    return newLine;
  }

  public render(): string | undefined {
    return this.multiLogger.render();
  }

  protected abstract gotKey(key: string): void;

  protected inputFinished() {
    this._readStream.destroy();
  }

  public waitForUserInput() {
    SHOW_CURSOR();
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
      SHOW_CURSOR();
    });
  }
}
