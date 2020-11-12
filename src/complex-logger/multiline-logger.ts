import { LineLogger } from '../line-logger/line-logger';
import { ILoggerParent } from '../models/logger-parent';
import { HIDE_CURSOR, INSERT_LINE, MOVE_DOWN, MOVE_UP, RESTORE_CURSOR, SAVE_CURSOR, SHOW_CURSOR } from '../utils';

export abstract class MultilineLogger implements ILoggerParent {
  private readonly _lineLogger: LineLogger[];

  constructor(lineLogger: LineLogger[]) {
    this._lineLogger = lineLogger;
    this._lineLogger.forEach(x => x['_parent'] = this);

    for (let i = 0; i < this._lineLogger.length; i++) {
      INSERT_LINE();
    }
    MOVE_UP(this._lineLogger.length);
    SAVE_CURSOR();

    this.render();
  }

  public childChanged(child: LineLogger): void {
    HIDE_CURSOR();
    RESTORE_CURSOR();
    const childIndex = this._lineLogger.indexOf(child);
    MOVE_DOWN(childIndex);
    const line = this._lineLogger[childIndex];
    line.render();
  }

  public render() {
    RESTORE_CURSOR();
    for (let i = 0; i < this._lineLogger.length; i++) {
      const line = this._lineLogger[i];
      line.render();
    }
  }
}
