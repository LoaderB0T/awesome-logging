import cliTruncate from 'cli-truncate';
import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';
import { LoggerManager } from '../models/logger-manager';

import { ILoggerParent } from '../models/logger-parent';
import { TextObject } from '../models/text-object';
import { DELETE_LINE, INSERT_LINE, INSERT_NEW_LINE, MOVE_UP } from '../utils';

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

  protected delete() {
    if (this._parent) {
      this._parent.deleteChild(this);
    } else {
      DELETE_LINE();
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

  public get currentLineCount(): number {
    return TextObject.lineCount(this._lastLine);
  }

  public render() {
    if (LoggerManager.activeLogger && !this._parent) {
      throw new Error('A complex logger is active, to log a single line, use the interrupt method');
    }

    const lastLineCount = this._firstRender ? 0 : TextObject.lineCount(this._lastLine);
    const text = this.getRenderText();
    const newLineCount = TextObject.lineCount(text ?? '');
    this.prepareCursor(lastLineCount, newLineCount);

    if (text) {
      process.stdout.write(text);
    }


    INSERT_LINE();
  }

  private getRenderText() {
    const newLine = this.getLine();
    const newString = TextObject.ensureString(newLine);
    if (this.changedLength !== 0) {
      const changedNewString = sliceAnsi(newString, 0, this.changedLength);
      return cliTruncate(changedNewString, process.stdout.columns);
    }
  }

  private prepareCursor(lastLineCount: number, newLineCount: number) {
    if (this._parent) {
      if (this._firstRender) {
        this._firstRender = false;
      }
    } else {
      if (!this._firstRender) {
        MOVE_UP(lastLineCount);
      } else {
        this._firstRender = false;
      }
    }
    for (let i = 0; i < lastLineCount - newLineCount; i++) {
      DELETE_LINE();
    }
    this._parent.insertLines(newLineCount - lastLineCount, this);

    // if (!this._parent && !this._firstRender) {
    // }
    // if (this._firstRender) {
    //   this._firstRender = false;
    //   INSERT_LINE();
    //   MOVE_UP(1);
    // } else if (!this._hasChanges) {
    //   INSERT_LINE();
    //   return;
    // }
  }
}
