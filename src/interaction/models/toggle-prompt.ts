import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeLoggerTextControl } from '../../logger/models/config/text';
import { AwesomeTextLogger } from '../../logger/models/text-logger';
import { TextObject } from '../../models/text-object';
import { KEY_ARROW_DOWN, KEY_ARROW_UP } from '../../utils/ansi-utils';
import { AwesomePromptToggleConfig, AwesomePromptToggleControl } from './config/toggle';
import { AwesomePromptBase } from './prompt-base';

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
    super(lines);
    this._lines = lines;
    this._currentHighlightedRow = 0;
    this._options = config.options ?? [];
    this._toggles = this._options.map(() => false);
  }

  private adjustLine(lineText: string, line: AwesomeTextLogger, highlighted: boolean, selected: boolean = false) {
    const newText = new TextObject(selected ? '[X] ' : '[ ] ', selected ? 'GREEN' : 'GRAY');
    newText.append(lineText, highlighted ? 'BLUE' : 'WHITE');
    line.setText(newText);
  }

  public init(): void {
    for (let i = 0; i < this._options.length; i++) {
      const options = this._options[i];
      const line = this._lines[i];
      this.adjustLine(options, line, i === 0);
    }
  }

  protected gotKey(key: string): void {
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
        if (
          this._currentHighlightedRow - this.scrollAmount > AwesomeLogger.maxLinesInTerminal - 2 &&
          this.scrollAmount < this._options.length - AwesomeLogger.maxLinesInTerminal
        ) {
          this.scrollAmount++;
        }
        this.renderLine(prevHighlightdLine);
        this.renderLine(this._currentHighlightedRow);
      }
    } else if (key === ' ') {
      this._toggles[this._currentHighlightedRow] = !this._toggles[this._currentHighlightedRow];
      this.renderLine(this._currentHighlightedRow);
    } else if (key.match(/^[\r\n]+$/)) {
      const result = new Array<string>();
      for (let i = 0; i < this._options.length; i++) {
        const option = this._options[i];
        const toggle = this._toggles[i];
        if (toggle) {
          result.push(option);
        }
      }
      this.inputFinished(result);
    }
  }

  private renderLine(i: number) {
    this.adjustLine(this._options[i], this._lines[i], i === this._currentHighlightedRow, this._toggles[i]);
  }

  protected resetViewAndShowResult(): void {
    const resultLog = new TextObject(' - Selected option(s): ', 'GRAY');

    const result = new Array<string>();
    for (let i = 0; i < this._options.length; i++) {
      const option = this._options[i];
      const toggle = this._toggles[i];
      if (toggle) {
        result.push(option);
      }
    }
    resultLog.append(result.join(', '), 'GREEN');
    this.multiLogger.getChild<AwesomeLoggerTextControl>(0).setText(resultLog);
  }
}
