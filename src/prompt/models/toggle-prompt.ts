import chalk from 'chalk';
import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeTextLogger } from '../../logger/models/text-logger';
import { KEY_ARROW_DOWN, KEY_ARROW_UP } from '../../utils/ansi-utils';
import { TerminalSize } from '../../utils/terminal-size';
import { AwesomePromptToggleConfig, AwesomePromptToggleControl } from './config/toggle';
import { AwesomePromptBase } from '../prompt-base';

export class AwesomeTogglePromt extends AwesomePromptBase<string[]> implements AwesomePromptToggleControl {
  private _currentHighlightedRow: number;
  private readonly _options: string[];
  private readonly _lines: AwesomeTextLogger[];
  private readonly _toggles: boolean[];

  constructor(config: Partial<AwesomePromptToggleConfig>) {
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
    this._toggles = this._options.map(() => false);
  }

  private adjustLine(lineText: string, line: AwesomeTextLogger, highlighted: boolean, selected: boolean = false) {
    const newText = `${selected ? chalk.green('[X]') : chalk.gray('[ ]')} ${(highlighted ? chalk.blue : chalk.white)(lineText)}`;
    line.setText(newText);
  }

  public init(): void {
    for (let i = 0; i < this._options.length; i++) {
      const options = this._options[i];
      const line = this._lines[i];
      this.adjustLine(options, line, i === 0);
    }
  }

  public getCurrentAnswer(): string[] | undefined {
    return this.calculateResult();
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
        if (this._currentHighlightedRow - this.scrollAmount > TerminalSize.terminalHeight - 4) {
          this.scrollAmount++;
        }
        this.renderLine(prevHighlightdLine);
        this.renderLine(this._currentHighlightedRow);
      }
    } else if (key === ' ') {
      this._toggles[this._currentHighlightedRow] = !this._toggles[this._currentHighlightedRow];
      this.renderLine(this._currentHighlightedRow);
    } else if (key.match(/^[\r\n]+$/)) {
      const result = this.calculateResult();
      this.inputFinished(result);
    }
  }

  private calculateResult() {
    const result = new Array<string>();
    for (let i = 0; i < this._options.length; i++) {
      const option = this._options[i];
      const toggle = this._toggles[i];
      if (toggle) {
        result.push(option);
      }
    }
    return result;
  }

  private renderLine(i: number) {
    this.adjustLine(this._options[i], this._lines[i], i === this._currentHighlightedRow, this._toggles[i]);
  }

  protected prepareResultLogger(): void {
    const result = new Array<string>();
    for (let i = 0; i < this._options.length; i++) {
      const option = this._options[i];
      const toggle = this._toggles[i];
      if (toggle) {
        result.push(option);
      }
    }
    const resultLog = chalk.gray(` - Selected option${result.length > 1 ? 's' : ''}: ${chalk.green(result.join(', '))}`);
    this.setLogger(AwesomeLogger.create('text', { text: resultLog }));
  }

  public needsScroll(): boolean {
    return true;
  }
}
