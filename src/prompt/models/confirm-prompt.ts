import chalk from 'chalk';
import { AwesomeLogger } from '../../awesome-logger';
import { AwesomePromptConfirmConfig, AwesomePromptConfirmControl } from './config/confirm';
import { AwesomePromptBase } from '../prompt-base';
import { AwesomeLoggerTextControl } from '../../logger';

export class AwesomeConfirmPromt extends AwesomePromptBase<boolean> implements AwesomePromptConfirmControl {
  private readonly _line: AwesomeLoggerTextControl;
  private readonly _text?: string;
  private _result?: boolean;

  constructor(config: Partial<AwesomePromptConfirmConfig>) {
    const text = `${config.text} ${chalk.gray('[')}${chalk.green('Y')}${chalk.gray('/')}${chalk.red('N')}${chalk.gray(']')}`;
    const line = AwesomeLogger.create('text', { text: text });
    super(line);
    this._text = config.text;
    this._line = line;
  }

  public init(): void {}

  public getCurrentAnswer(): undefined {
    return undefined;
  }

  public gotKey(key: string): void {
    if (key === 'y') {
      this._result = true;
      this.inputFinished(true);
    } else if (key === 'n') {
      this._result = false;
      this.inputFinished(false);
    }
  }

  protected prepareResultLogger(): void {
    const coloredY = this._result ? chalk.green('Y') : chalk.gray('Y');
    const coloredN = !this._result ? chalk.red('N') : chalk.gray('N');

    const result = `${this._text} ${chalk.gray('[')}${coloredY}${chalk.gray('/')}${coloredN}${chalk.gray(']')}`;
    this.setLogger(AwesomeLogger.create('text', { text: result }));
  }

  public needsScroll(): boolean {
    return false;
  }
}
