import chalk from 'chalk';
import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeTextLogger } from '../../logger/models/text-logger';
import { KEY_ARROW_DOWN, KEY_ARROW_UP } from '../../utils/ansi-utils';
import { TerminalSize } from '../../utils/terminal-size';
import { AwesomePromptChoiceConfig, AwesomePromptChoiceControl } from './config/choice';
import { AwesomePromptBase } from '../prompt-base';

export class AwesomeChoicePromt extends AwesomePromptBase<string> implements AwesomePromptChoiceControl {
  private _currentHighlightedRow: number;
  private readonly _options: string[];
  private readonly _lines: AwesomeTextLogger[];

  constructor(config: Partial<AwesomePromptChoiceConfig>) {
    const lines =
      config.options?.map(() => {
        const newline = new AwesomeTextLogger({ text: '' });
        return newline;
      }) ?? [];
    const multi = AwesomeLogger.create('multi', { children: lines });
    super(multi);
    this._lines = lines;
    this._currentHighlightedRow = 0;
    this._options = config.options ?? [];
  }

  private adjustLine(lineText: string, line: AwesomeTextLogger, highlighted: boolean) {
    const newText = `${chalk.gray(' - ')} ${(highlighted ? chalk.blue : chalk.white)(lineText)}`;
    line.setText(newText);
  }

  public init(): void {
    for (let i = 0; i < this._options.length; i++) {
      const options = this._options[i];
      const line = this._lines[i];
      this.adjustLine(options, line, i === 0);
    }
  }

  public getCurrentAnswer(): string | undefined {
    return this._options[this._currentHighlightedRow];
  }

  public gotKey(key: string): void {
    if (key === KEY_ARROW_UP) {
      if (this._currentHighlightedRow > 0) {
        const prevHighlightedLine = this._currentHighlightedRow;
        this._currentHighlightedRow--;
        if (this._currentHighlightedRow - this.scrollAmount < 1 && this.scrollAmount > 0) {
          this.scrollAmount--;
        }
        this.renderLine(prevHighlightedLine);
        this.renderLine(this._currentHighlightedRow);
      }
    } else if (key === KEY_ARROW_DOWN) {
      if (this._currentHighlightedRow < this._lines.length - 1) {
        const prevHighlightdLine = this._currentHighlightedRow;
        this._currentHighlightedRow++;
        if (this._currentHighlightedRow - this.scrollAmount > TerminalSize.terminalHeight - 2) {
          this.scrollAmount++;
        }
        this.renderLine(prevHighlightdLine);
        this.renderLine(this._currentHighlightedRow);
      }
    } else if (key.match(/^[\r\n]+$/)) {
      this.inputFinished(this._options[this._currentHighlightedRow]);
    }
  }

  private renderLine(i: number) {
    this.adjustLine(this._options[i], this._lines[i], i === this._currentHighlightedRow);
  }

  protected prepareResultLogger(): void {
    const result = this._options[this._currentHighlightedRow];
    const resultLog = chalk.gray(` - Selected option: ${chalk.green(result)}`);
    this.setLogger(AwesomeLogger.create('text', { text: resultLog }));
  }

  public needsScroll(): boolean {
    return true;
  }
}
