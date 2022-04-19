import chalk from 'chalk';
import { AwesomeLogger } from '../../awesome-logger.js';
import { KEY_ARROW_DOWN, KEY_ARROW_UP } from '../../utils/ansi-utils.js';
import { TerminalSize } from '../../utils/terminal-size.js';
import { AwesomePromptToggleConfig, AwesomePromptToggleControl } from './config/toggle.js';
import { AwesomePromptBase } from '../prompt-base.js';
import { AwesomeLoggerTextControl } from '../../logger';

export class AwesomeTogglePromt extends AwesomePromptBase<string[]> implements AwesomePromptToggleControl {
  private _currentHighlightedRow: number;
  private readonly _text?: string;
  private readonly _options: string[];
  private readonly _lines: string[];
  private readonly _textLogger: AwesomeLoggerTextControl;
  private readonly _toggles: boolean[];

  constructor(config: Partial<AwesomePromptToggleConfig>) {
    const textLogger = AwesomeLogger.create('text', { text: '' });
    super(textLogger);
    this._text = config.text;
    this.fixedLineCount = this._text ? 1 : 0;
    this._textLogger = textLogger;
    this._currentHighlightedRow = 0;
    this._options = config.options ?? [];
    this._lines = [...this._options];
    this._toggles = this._options.map(() => false);
  }

  private adjustLine(lineText: string, index: number, highlighted: boolean, selected: boolean = false) {
    const newText = `${selected ? chalk.green('[X]') : chalk.gray('[ ]')} ${(highlighted ? chalk.blue : chalk.white)(lineText)}`;
    this._lines[index] = newText;
  }

  public init(): void {
    const allIndices: number[] = [];
    for (let i = 0; i < this._options.length; i++) {
      allIndices.push(i);
    }
    this.renderLines(...allIndices);
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
        this.renderLines(prevHighlightedLine, this._currentHighlightedRow);
      }
    } else if (key === KEY_ARROW_DOWN) {
      if (this._currentHighlightedRow < this._lines.length - 1) {
        const prevHighlightedLine = this._currentHighlightedRow;
        this._currentHighlightedRow++;
        if (this._currentHighlightedRow - this.scrollAmount > TerminalSize.terminalHeight - 2 - this.fixedLineCount) {
          this.scrollAmount++;
        }
        this.renderLines(prevHighlightedLine, this._currentHighlightedRow);
      }
    } else if (key === ' ') {
      this._toggles[this._currentHighlightedRow] = !this._toggles[this._currentHighlightedRow];
      this.renderLines(this._currentHighlightedRow);
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

  private renderLines(...indices: number[]) {
    indices.forEach(i => {
      this.adjustLine(this._options[i], i, i === this._currentHighlightedRow, this._toggles[i]);
    });
    if (this._text) {
      this._textLogger.setText(`${this._text}\n${this._lines.join('\n')}`);
    } else {
      this._textLogger.setText(this._lines.join('\n'));
    }
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
