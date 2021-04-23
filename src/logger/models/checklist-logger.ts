import { AwesomeLogger } from '../../awesome-logger';
import { TextObject } from '../../models/text-object';
import { AwesomeLoggerBase } from '../models/logger-base';
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

  public getNextLine(): TextObject {
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

    let firstUnfinishedOptionIndex = this._options.items.findIndex(x => x.state === 'inProgress' || x.state === 'pending');
    const maxScrollAmount = this._options.items.length - AwesomeLogger.maxLinesInTerminal;
    if (firstUnfinishedOptionIndex === -1) {
      firstUnfinishedOptionIndex = maxScrollAmount;
    }

    this.scrollAmount = Math.min(firstUnfinishedOptionIndex, maxScrollAmount);

    this._multiLine.getChild<AwesomeTextLogger>(index).setText(this.calculateLine(index));
  }

  private calculateLine(index: number): TextObject {
    const item = this._options.items[index];
    const prefix = this.getPrefix(item.state);
    prefix.append(` ${item.text}`);
    return prefix;
  }

  private getPrefix(state: AwesomeChecklistLoggerState): TextObject {
    switch (state) {
      case 'done':
        return new TextObject(' √', 'GREEN');
      case 'failed':
        return new TextObject(' X', 'RED');
      case 'inProgress':
        return new TextObject(' >', 'BLUE');
      case 'partiallySucceeded':
        return new TextObject(' !', 'YELLOW');
      case 'skipped':
        return new TextObject(' ■', 'GREEN');
      case 'pending':
        return new TextObject(' ■', 'GRAY');
      case 'succeeded':
        return new TextObject(' √', 'GREEN');
      default:
        return new TextObject(' ?', 'GRAY');
    }
  }
}
