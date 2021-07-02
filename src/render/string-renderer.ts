import stripAnsi from 'strip-ansi';
import sliceAnsi from 'slice-ansi';

import { DELETE_LINE, MOVE_LEFT, MOVE_UP } from '../utils/ansi-utils';
import { ConsoleLog } from '../utils/console-log';
import { TerminalSize } from '../utils/terminal-size';

export class StringRenderer {
  public static lastString: string = '';
  private static lastTerminalHeight: number = TerminalSize.terminalHeight;

  public static renderString(val: string, interruptLog: boolean, ignoreLastLine: boolean) {
    let lastLines = this.lastString && !ignoreLastLine ? this.lastString.split(/[\r\n]+/g) : [];

    if (this.lastTerminalHeight !== TerminalSize.terminalHeight) {
      this.lastTerminalHeight = TerminalSize.terminalHeight;
      // When the terminal is resized, we try do delete everything and re-print everything.
      // Deleting lines that are out of scroll view is not possible in some terminals (powershell, cmd, and more on windows for example)
      // We still try to do so, but when reducing the height in the terminal some lines will get "stuck" in the history
      for (let i = 0; i < lastLines.length; i++) {
        DELETE_LINE();
        MOVE_UP();
      }
      // resetting lastString & lastLine to make it reprint everything
      this.lastString = '';
      lastLines = [];
    }

    this.lastString = interruptLog ? '' : val;
    const newLines = val.split(/[\r\n]+/g);

    const lengthDifference = newLines.length - lastLines.length;
    const lessLines = lengthDifference < 0 ? lengthDifference * -1 : 0;

    if (lengthDifference < 0) {
      for (let i = 0; i < lessLines; i++) {
        DELETE_LINE();
        MOVE_UP();
      }
    }

    let moveUpAmount = lastLines.length - lessLines - 1;
    if (moveUpAmount < 0) {
      moveUpAmount = 0;
    }

    MOVE_UP(moveUpAmount);
    MOVE_LEFT();

    for (let i = 0; i < newLines.length; i++) {
      const oldLine = lastLines[i] ?? '';
      const newLine = newLines[i];
      const lineToPrint = this.getLineStringToPrint(oldLine, newLine);
      if (i !== 0) {
        ConsoleLog.log();
      }
      process.stdout.write(lineToPrint);
    }
  }

  private static getLineStringToPrint(oldVal: string, newVal: string) {
    if (oldVal === newVal) {
      // We don't need to calculate anything if the strings are identical
      return '';
    }
    const cleanOldString = stripAnsi(oldVal);
    let cleanNewString = stripAnsi(newVal);

    const cleanStringsEqual = cleanOldString === cleanNewString;
    if (cleanStringsEqual) {
      // The strings only differ in special ansi modifiers but the text is the same
      // Detecting what changed in terms of ansi stuff is very difficult to detect performance wise
      // Rewriting the whole string takes less time in that case
      return newVal;
    }
    const oldStrLen = cleanOldString.length;
    let newStrLen = cleanNewString.length;
    if (newStrLen > oldStrLen) {
      // When the new string is longer than the old string, it will just overwrite anything
      return newVal;
    }
    let newStringWouldHaveBeenShorter = false;
    while (oldStrLen > newStrLen) {
      // If the new string is shorter than the old string, we need to "erase" the difference by printing spaces
      newVal += ' ';
      cleanNewString += ' ';
      newStrLen++;
      newStringWouldHaveBeenShorter = true;
    }
    if (newStringWouldHaveBeenShorter) {
      // We know that we have to print everything anyways because of the erasing spaces at the end, no need to calculate the difference
      return newVal;
    }
    for (let i = newStrLen - 1; i >= 0; i--) {
      const oldCharAtI = cleanOldString.substr(i, 1);
      const newCharAtI = cleanNewString.substr(i, 1);
      if (oldCharAtI !== newCharAtI) {
        return sliceAnsi(newVal, 0, i + 1);
      }
    }
    return '';
  }
}
