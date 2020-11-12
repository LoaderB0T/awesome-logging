import { LineLogger } from '../line-logger/line-logger';
import { LoggerManager } from '../models/logger-manager';
import { ILoggerParent } from '../models/logger-parent';
import { DELETE_LINE, HIDE_CURSOR, INSERT_LINE, INSERT_NEW_LINE, MOVE_DOWN, MOVE_LEFT, MOVE_UP, RESTORE_CURSOR, SAVE_CURSOR, SHOW_CURSOR } from '../utils';

export abstract class MultilineLogger implements ILoggerParent {
  private readonly _lineLogger: LineLogger[];

  constructor(lineLogger: LineLogger[]) {
    LoggerManager.registerLogger(this);
    this._lineLogger = lineLogger;
    this._lineLogger.forEach(x => x['_parent'] = this);

    for (let i = 0; i < this._lineLogger.length; i++) {
      INSERT_LINE();
    }
    MOVE_UP(this._lineLogger.length);
    MOVE_LEFT();
    SAVE_CURSOR();

    this.render();
  }

  private countLines(maxIndex?: number) {
    if (maxIndex === undefined) {
      return this._lineLogger.map(x => x.currentLineCount).reduce((a, b) => a + b, 0);
    }

    let lineCount = 0;
    for (let i = 0; i < maxIndex; i++) {
      const cl = this._lineLogger[i];
      lineCount += cl.currentLineCount;
    }
    return lineCount;
  }

  public insertLines(newLineCount: number, child: LineLogger): void {
    const childIndex = this._lineLogger.indexOf(child);
    const lineCountUntilChild = this.countLines(childIndex);
    const totalLineCount = this.countLines();

    for (let i = 0; i < newLineCount; i++) {
      RESTORE_CURSOR();
      MOVE_DOWN(totalLineCount);
      INSERT_LINE();
      RESTORE_CURSOR();
      MOVE_DOWN(lineCountUntilChild);
      INSERT_NEW_LINE();
    }
  }

  public childChanged(child: LineLogger): void {
    // HIDE_CURSOR();
    RESTORE_CURSOR();
    const childIndex = this._lineLogger.indexOf(child);
    const lineCount = this.countLines(childIndex);

    MOVE_DOWN(lineCount);
    const line = this._lineLogger[childIndex];
    line.render();
  }

  public deleteChild(child: LineLogger): void {
    // HIDE_CURSOR();
    RESTORE_CURSOR();
    const childIndex = this._lineLogger.indexOf(child);
    this._lineLogger.splice(childIndex, 1);
    MOVE_DOWN(childIndex);
    DELETE_LINE();
  }

  public interrupt(logger: LineLogger) {
    RESTORE_CURSOR();
    INSERT_NEW_LINE();
    const text = logger['getRenderText']();
    MOVE_DOWN(this._lineLogger.length);
    INSERT_LINE();
  }

  public render() {
    RESTORE_CURSOR();
    for (let i = 0; i < this._lineLogger.length; i++) {
      const line = this._lineLogger[i];
      line.render();
    }
  }
}
