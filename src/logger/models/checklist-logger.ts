import chalk from 'chalk';
import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeLoggerBase } from '../logger-base';
import { AwesomeChecklistLoggerConfig, AwesomeChecklistLoggerControl, AwesomeChecklistLoggerState } from './config/checklist';
import { AwesomeMultiLogger } from './multi-logger';
import { AwesomeTextLogger } from './text-logger';

export class AwesomeChecklistLogger extends AwesomeLoggerBase implements AwesomeChecklistLoggerControl {
  private readonly _options: AwesomeChecklistLoggerConfig;
  private readonly _multiLine: AwesomeMultiLogger;

  constructor(options?: Partial<AwesomeChecklistLoggerConfig>) {
    super();
    if (!options?.items) {
      throw new Error('Cannot initiate AwesomeChecklistLogger without any items');
    }
    this._options = { items: options.items };
    const lineChildren: AwesomeTextLogger[] = [];
    for (let i = 0; i < this._options.items.length; i++) {
      lineChildren.push(AwesomeLogger.create('text', { text: this.calculateLine(i) }) as AwesomeTextLogger);
    }

    this._multiLine = AwesomeLogger.create('multi', { children: lineChildren }) as AwesomeMultiLogger;
  }

  public hasChanges(): boolean {
    return this._multiLine.hasChanges();
  }

  public canBeCalledFrom(calledFrom: AwesomeLoggerBase): boolean {
    return calledFrom === this || this._multiLine.canBeCalledFrom(calledFrom);
  }

  public getNextLine(): string {
    return this._multiLine.getNextLine();
  }

  public needsScroll() {
    return true;
  }

  public changeState(index: number, state: AwesomeChecklistLoggerState, newText?: string): void {
    const item = this._options.items[index];
    if (!item) {
      throw new Error('item index out of range');
    }

    if (item.state === state && (!newText || item.text === newText)) {
      return;
    }

    item.state = state;
    if (newText) {
      item.text = newText!;
    }

    let scroll = 0;
    const firstUnfinishedOptionIndex = this._options.items.findIndex(x => x.state === 'inProgress' || x.state === 'pending');
    if (firstUnfinishedOptionIndex !== -1) {
      scroll = firstUnfinishedOptionIndex;
    } else {
      // This is "too far" but the scrollwindow will handle this gracefully
      scroll = this._options.items.length;
    }

    this.scrollAmount = scroll;

    // todo: interrupt with already finished items that are scrolled away

    this._multiLine.getChild<AwesomeTextLogger>(index).setText(this.calculateLine(index));
  }

  private calculateLine(index: number): string {
    const item = this._options.items[index];
    const prefix = `${this.getPrefix(item.state)} ${item.text}`;
    return prefix;
  }

  private getPrefix(state: AwesomeChecklistLoggerState): string {
    switch (state) {
      case 'done':
        return chalk.green(' √');
      case 'failed':
        return chalk.red(' X');
      case 'inProgress':
        return chalk.blue(' >');
      case 'partiallySucceeded':
        return chalk.yellow(' !');
      case 'skipped':
        return chalk.green(' ■');
      case 'pending':
        return chalk.gray(' ■');
      case 'succeeded':
        return chalk.green(' √');
      default:
        return chalk.gray(' ?');
    }
  }
}
