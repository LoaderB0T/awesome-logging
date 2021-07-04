import stripAnsi from 'strip-ansi';

import { DELETE_LINE, MOVE_LEFT, MOVE_UP } from '../utils/ansi-utils';
import { ConsoleLog } from '../utils/console-log';
import { TerminalSize } from '../utils/terminal-size';

// @internal
export class StringRenderer {
  public static lastString: string = '';
  private static lastTerminalHeight: number = TerminalSize.terminalHeight;

  public static renderString(val: string, interruptLog: boolean, ignoreLastLine: boolean, newLog: boolean) {
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
      if (i !== 0 || newLog) {
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
    const oldStringLength = stripAnsi(oldVal).length;
    let newStringLength = stripAnsi(newVal).length;

    while (oldStringLength > newStringLength) {
      // If the new string is shorter than the old string, we need to "erase" the difference by printing spaces
      newVal += ' ';
      newStringLength++;
    }
    return newVal;
  }
}
