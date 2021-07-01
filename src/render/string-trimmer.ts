import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';

export class StringTrimmer {
  private static get terminalSize() {
    return process.stdout?.getWindowSize?.() ?? [150, 10];
  }

  private static get terminalHeight() {
    return this.terminalSize[1];
  }
  private static get terminalWidth() {
    return this.terminalSize[0];
  }

  public static ensureConsoleFit(val: string): string {
    const rowsTrimmed = this.ensureRowsLength(val);
    const rowCount = this.ensureRowsCount(rowsTrimmed);
    return rowCount;
  }

  static ensureRowsCount(rowsTrimmed: string[]) {
    return rowsTrimmed.slice(0, this.terminalHeight).join('\n');
  }

  private static ensureRowsLength(val: string): string[] {
    // Splitting the whole string into the lines that are "forced" by the logger
    const predefinedLines = val.split(/\r?\n/);
    const actualLines = predefinedLines
      .map(preLine => {
        const cleanLine = stripAnsi(preLine);
        let rest = cleanLine;
        const res: string[] = [];
        // If the forced line is longer that the maximal width of our terminal, split it up into sections that do fit
        while (rest.length > this.terminalWidth) {
          const maxLengthString = sliceAnsi(rest, 0, this.terminalWidth);
          res.push(maxLengthString);
          rest = sliceAnsi(rest, this.terminalWidth);
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
