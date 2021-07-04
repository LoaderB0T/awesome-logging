import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';
import { TerminalSize } from '../utils/terminal-size';

export class StringTrimmer {
  public static ensureConsoleFit(val: string, limitRowCount: boolean, scollAmount: number): string {
    const rowsTrimmed = this.ensureRowsLength(val);
    const rowCount = limitRowCount ? this.ensureRowsCount(rowsTrimmed, scollAmount) : rowsTrimmed;
    return rowCount.join('\n');
  }

  static ensureRowsCount(rowsTrimmed: string[], scrollAmount: number) {
    const maxRowCount = TerminalSize.terminalHeight;
    const actualRowCount = rowsTrimmed.length;
    if (maxRowCount >= actualRowCount) {
      return rowsTrimmed;
    }
    if (scrollAmount < 0) {
      scrollAmount = 0;
    } else if (scrollAmount > actualRowCount - maxRowCount) {
      scrollAmount = actualRowCount - maxRowCount;
    }
    const visibleRows = rowsTrimmed.slice(scrollAmount, scrollAmount + maxRowCount);
    const visibleRowsWithScrollPrefix: string[] = [];

    for (let i = 0; i < visibleRows.length; i++) {
      let visibleRow = visibleRows[i];
      if (i === 0 && scrollAmount > 0) {
        visibleRow = '↑ ' + visibleRow;
      } else if (i === maxRowCount - 1 && scrollAmount < actualRowCount - maxRowCount) {
        visibleRow = '↓ ' + visibleRow;
      } else {
        visibleRow = '| ' + visibleRow;
      }
      visibleRowsWithScrollPrefix.push(visibleRow);
    }

    return visibleRowsWithScrollPrefix;
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
          // The line length is limited to two characters less than the actual length
          // so that the scroll indicators can be printed, if needed
          const maxLengthString = sliceAnsi(rest, 0, TerminalSize.terminalWidth - 2);
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
