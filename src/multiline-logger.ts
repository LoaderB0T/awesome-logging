import { LineLogger } from './line-logger';

export class MultilineLogger {
  private readonly _lineLogger: LineLogger[];

  constructor(lineLogger: LineLogger[]) {
    this._lineLogger = lineLogger;
  }

  public render() {
    for (let i = 0; i < this._lineLogger.length; i++) {
      const line = this._lineLogger[i];
      const [, maxHeight] = process.stdout.getWindowSize();
      process.stdout.cursorTo(0, maxHeight - (this._lineLogger.length - 1 - i));
      line.render();
    }
  }
}
