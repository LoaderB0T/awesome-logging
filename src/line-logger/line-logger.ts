import cliTruncate from 'cli-truncate';
import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';

import { ILoggerParent } from '../models/logger-parent';
import { TextObject } from '../models/text-object';
import { INSERT_LINE, MOVE_UP } from '../utils';

export abstract class LineLogger {
  private _lastLine: string | TextObject | TextObject[];
  private _changedLength: number;
  private _firstRender: boolean = true;
  private _parent: ILoggerParent;
  private _hasChanges: boolean = true;

  constructor() {
    this._lastLine = '';
  }

  protected abstract getNextLine(): string | TextObject | TextObject[];

  protected changed() {
    this._hasChanges = true;
    if (this._parent) {
      this._parent.childChanged(this);
    } else {
      this.render();
    }
  }

  public getLine(): string | TextObject | TextObject[] {
    let newLine = this.getNextLine();
    this._hasChanges = false;
    this._changedLength = this.calculateChangedLength(this._lastLine, newLine);
    this._lastLine = newLine;

    while (this._changedLength > TextObject.lineWidth(newLine)) {
      if (Array.isArray(newLine)) {
        newLine[newLine.length - 1].text += ' ';
      } else if (typeof newLine === 'object') {
        newLine.text += ' ';
      } else {
        (newLine as string) += ' ';
      }
    }

    return newLine;
  }

  public get changedLength(): number {
    return this._changedLength;
  }

  private calculateChangedLength(lastLine: string | TextObject | TextObject[], newLine: string | TextObject | TextObject[]): number {
    const lastString = TextObject.ensureString(lastLine);
    const newString = TextObject.ensureString(newLine);
    const lastStrWidth = TextObject.lineWidth(lastString);
    const newStrWidth = TextObject.lineWidth(newString);

    if (newStrWidth > lastStrWidth) {
      return newStrWidth;
    }

    if ((lastLine as TextObject).color !== (newLine as TextObject).color) {
      return Math.max(newStrWidth, lastStrWidth);
    }

    if (lastStrWidth > newStrWidth) {
      return lastStrWidth;
    }

    let unequalChars = 0;
    const strippedLastStr = stripAnsi(lastString);
    const strippedNewStr = stripAnsi(newString);
    for (let i = 0; i < lastStrWidth; i++) {
      const lastChar = strippedLastStr[i];
      const newCharChar = strippedNewStr[i];
      if (lastChar !== newCharChar) {
        unequalChars = i + 1;
      }
    }
    return unequalChars;
  }

  public render() {
    if (!this._hasChanges) {
      INSERT_LINE();
      return;
    }
    const newLine = this.getLine();
    const newString = TextObject.ensureString(newLine);
    if (this._firstRender) {
      this._firstRender = false;
      INSERT_LINE();
      MOVE_UP(1);
    }
    if (this.changedLength !== 0) {
      const changedNewString = sliceAnsi(newString, 0, this.changedLength);
      const fittingString = cliTruncate(changedNewString, process.stdout.columns);
      process.stdout.write(fittingString);
    }
    INSERT_LINE();
  }
}
