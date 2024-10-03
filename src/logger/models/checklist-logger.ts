import chalk from 'chalk';

import { AwesomeLogger } from '../../awesome-logger.js';
import { AwesomeLoggerBase } from '../logger-base.js';
import {
  AwesomeChecklistLoggerConfig,
  AwesomeChecklistLoggerControl,
  AwesomeChecklistLoggerState,
} from './config/checklist.js';
import { AwesomeMultiLogger } from './multi-logger.js';
import { AwesomeTextLogger } from './text-logger.js';

export class AwesomeChecklistLogger
  extends AwesomeLoggerBase
  implements AwesomeChecklistLoggerControl
{
  private readonly _options: AwesomeChecklistLoggerConfig;
  private readonly _multiLine: AwesomeMultiLogger;

  constructor(options?: Partial<AwesomeChecklistLoggerConfig>) {
    super('multi');
    if (!options?.items) {
      throw new Error('Cannot initiate AwesomeChecklistLogger without any items');
    }
    this._options = { items: options.items, logAllFinalStates: options.logAllFinalStates ?? false };
    const lineChildren: AwesomeTextLogger[] = [];
    for (let i = 0; i < this._options.items.length; i++) {
      lineChildren.push(
        AwesomeLogger.create('text', { text: this.calculateLine(i) }) as AwesomeTextLogger
      );
    }

    this._multiLine = AwesomeLogger.create('multi', {
      children: lineChildren,
    }) as AwesomeMultiLogger;
  }

  public end(): boolean {
    for (let i = 0; i < this._options.items.length; i++) {
      // If logAllFinalStates is true, we don't want to log states that are final, because they are already logged.
      const shouldLogOption =
        !this._options.logAllFinalStates || !this.isFinalState(this._options.items[i].state);
      if (shouldLogOption) {
        AwesomeLogger.interrupt(this.calculateLine(i));
      }
    }

    this.clean();
    return true;
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
    const firstUnfinishedOptionIndex = this._options.items.findIndex(
      x => x.state === 'inProgress' || x.state === 'pending'
    );
    if (firstUnfinishedOptionIndex !== -1) {
      scroll = firstUnfinishedOptionIndex;
    } else {
      // This is "too far" but the scrollwindow will handle this gracefully
      scroll = this._options.items.length;
    }

    this.scrollAmount = scroll;

    if (this._options.logAllFinalStates && this.isFinalState(state)) {
      AwesomeLogger.interrupt(this.calculateLine(index));
    }

    this._multiLine.getChild<AwesomeTextLogger>(index).setText(this.calculateLine(index));
    // No need to call restrictedChanged here, because the textlogger does already handle that.
  }

  private calculateLine(index: number): string {
    const item = this._options.items[index];
    const prefix = this.getPrefix(item.state);
    return `${prefix} ${item.text}`;
  }

  private isFinalState(state: AwesomeChecklistLoggerState): boolean {
    return (
      state === 'done' ||
      state === 'failed' ||
      state === 'succeeded' ||
      state === 'skipped' ||
      state === 'partiallySucceeded'
    );
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
