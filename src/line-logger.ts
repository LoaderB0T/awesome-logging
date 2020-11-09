import cliTruncate from 'cli-truncate';
import stringWidth from 'string-width';
import { colorize } from './logger-color';
import { TextObject } from './text-object';
import { MOVE_UP } from './utils';

export abstract class LineLogger {
  private _lastLine: string | TextObject;
  private _changedLength: number;
  private _firstRender: boolean = true;

  constructor() {
    this._lastLine = '';
  }

  protected abstract getNextLine(): string | TextObject;

  private ensureString(line: string | TextObject) {
    const isObj = typeof line === 'object';
    if (!isObj) {
      return line as string;
    }
    const lineObj = line as TextObject;

    lineObj.color;
    return colorize(lineObj.color)(lineObj.text);
  }

  private lineWidth(line: string | TextObject) {
    const lineStr = this.ensureString(line);
    return stringWidth(lineStr);
  }

  public getLine(): string | TextObject {
    let newLine = this.getNextLine();
    this._changedLength = this.calculateChangedLength(this._lastLine, newLine);
    this._lastLine = newLine;

    while (this._changedLength > this.lineWidth(newLine)) {
      if (typeof newLine === 'object') {
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

  private calculateChangedLength(lastLine: string | TextObject, newLine: string | TextObject): number {
    const lastString = this.ensureString(lastLine);
    const newString = this.ensureString(newLine);
    const lastStrWidth = this.lineWidth(lastString);
    const newStrWidth = this.lineWidth(newString);

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
    for (let i = 0; i < lastStrWidth; i++) {
      const lastChar = lastString[i];
      const newCharChar = newString[i];
      if (lastChar !== newCharChar) {
        unequalChars = i + 1;
      }
    }
    return unequalChars;
  }

  public render() {
    const newLine = this.getLine();
    const newString = this.ensureString(newLine);
    if (this._firstRender) {
      this._firstRender = false;
      console.log('');
      process.stdout.write(MOVE_UP);
    }
    if (this.changedLength !== 0) {
      const fittingString = cliTruncate(newString, process.stdout.columns - 2);
      process.stdout.write(fittingString);
    }
    console.log('');
  }
}
