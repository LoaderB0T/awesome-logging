import { LineLogger } from './line-logger';
import { MOVE_UP } from './utils';

export class MultilineLogger {
  private readonly _lineLogger: LineLogger[];
  private _firstRender: boolean = true;

  constructor(lineLogger: LineLogger[]) {
    this._lineLogger = lineLogger;
  }

  public render() {
    if (this._firstRender) {
      this._firstRender = false;
    } else {
      for (let i = 0; i < this._lineLogger.length; i++) {
        process.stdout.write(MOVE_UP);
      }
    }
    for (let i = 0; i < this._lineLogger.length; i++) {
      const line = this._lineLogger[i];
      line.render();
    }
  }
}
