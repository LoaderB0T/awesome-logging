import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';
import { TerminalSize } from '../utils/terminal-size';

export class StringTrimmer {
  public static ensureConsoleFit(val: string, limitRowCount: boolean): string {
    const rowsTrimmed = this.ensureRowsLength(val);
    const rowCount = limitRowCount ? this.ensureRowsCount(rowsTrimmed) : rowsTrimmed;
    return rowCount.join('\n');
  }

  static ensureRowsCount(rowsTrimmed: string[]) {
    return rowsTrimmed.slice(0, TerminalSize.terminalHeight);
  }

  private static ensureRowsLength(val: string): string[] {
    // Splitting the whole string into the lines that are "forced" by the logger
    const predefinedLines = val.split(/\r?\n/);
    const actualLines = predefinedLines
      .map(preLine => {
        let rest = preLine;
        const res: string[] = [];
        // If the forced line is longer that the maximal width of our terminal, split it up into sections that do fit
        while (stripAnsi(rest).length > TerminalSize.terminalWidth) {
          const maxLengthString = sliceAnsi(rest, 0, TerminalSize.terminalWidth);
          res.push(maxLengthString);
          rest = sliceAnsi(rest, TerminalSize.terminalWidth);
        }
        if (rest) {
          res.push(rest);
        }
        return res;
      })
      .flat();
    return actualLines;
  }
}
