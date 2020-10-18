export abstract class LineLogger {
  private lastLine: string;
  private _changedLength: number;

  protected abstract getNextLine(): string;

  public getLine(): string {
    const newLine = this.getNextLine();
    this._changedLength = this.calculateChangedLength(this.lastLine, newLine);
    this.lastLine = newLine;
    return this.lastLine;
  }
  public get changedLength(): number {
    return this._changedLength;
  }


  private calculateChangedLength(lastLine: string, newLine: string): number {
    if (newLine.length > lastLine.length) {
      return newLine.length;
    }
    if (lastLine.length > newLine.length) {
      return lastLine.length;
    }
    let unequalChars = 0;
    for (let i = 0; i < lastLine.length; i++) {
      const lastChar = lastLine[i];
      const newCharChar = lastLine[i];
      if (lastChar !== newCharChar) {
        unequalChars = i + 1;
      }
    }
    return unequalChars;
  }

  public render() {
    const newLine = this.getLine();
    if (this.changedLength !== 0) {
      const [maxWidth,] = process.stdout.getWindowSize();
      const printText = (newLine.length > maxWidth) ? newLine.substr(0, maxWidth) : newLine;
      process.stdout.write(printText);
    }
  }
}
