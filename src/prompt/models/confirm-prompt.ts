import chalk from 'chalk';
import { AwesomeLogger } from '../../awesome-logger.js';
import { AwesomePromptConfirmConfig, AwesomePromptConfirmControl } from './config/confirm.js';
import { AwesomePromptBase } from '../prompt-base.js';
import { AwesomeLoggerTextControl } from '../../logger';

export class AwesomeConfirmPromt extends AwesomePromptBase<boolean> implements AwesomePromptConfirmControl {
  private readonly _line: AwesomeLoggerTextControl;
  private readonly _text?: string;
  private readonly _default?: 'yes' | 'no';
  private _result?: boolean;

  constructor(config: Partial<AwesomePromptConfirmConfig>) {
    const text = `${config.text} ${chalk.gray('[')}${chalk.green('y')}${chalk.gray('/')}${chalk.red('n')}${chalk.gray(']')}`;
    const line = AwesomeLogger.create('text', { text: text });
    super(line);
    this._text = config.text;
    this._default = config.default;
    this._line = line;
  }

  public init(): void {
    // Nothing to initialize
  }

  public getCurrentAnswer(): undefined {
    return undefined;
  }

  public gotKey(key: string): void {
    if (key === 'y') {
      this._result = true;
    } else if (key === 'n') {
      this._result = false;
    } else if (key === '\n') {
      if (this._default) {
        this._result = this._default === 'yes';
      } else {
        return;
      }
    } else {
      return;
    }
    this.inputFinished(this._result);
  }

  protected prepareResultLogger(): void {
    const coloredY = this._result ? chalk.green('Y') : chalk.gray('y');
    const coloredN = !this._result ? chalk.red('N') : chalk.gray('n');

    const result = `${this._text} ${chalk.gray('[')}${coloredY}${chalk.gray('/')}${coloredN}${chalk.gray(']')}`;
    this.setLogger(AwesomeLogger.create('text', { text: result }));
  }

  public needsScroll(): boolean {
    return false;
  }
}
