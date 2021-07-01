import chalk from 'chalk';
import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeLoggerTextControl } from '../../logger/models/config/text';
import { CONTROL_PREFIX, KEY_ARROW_LEFT, KEY_ARROW_RIGHT } from '../../utils/ansi-utils';
import { AwesomePromptTextConfig, AwesomePromptTextControl } from './config/text';
import { AwesomePromptBase } from './prompt-base';

export class AwesomeTextPromt extends AwesomePromptBase<string> implements AwesomePromptTextControl {
  private readonly _questionLogger: AwesomeLoggerTextControl;
  private readonly _answerLogger: AwesomeLoggerTextControl;
  private readonly _text: string;
  private readonly _caseInsensitive: boolean;
  private readonly _autoComplete: string[];
  private readonly _fuzzyAutoComplete: boolean;
  private readonly _default: string;
  private readonly _validator: (v: any) => boolean | Promise<boolean>;
  private _currentAnswer: string;
  private _cursorPos: number;

  constructor(config: Partial<AwesomePromptTextConfig>) {
    const questionLogger = AwesomeLogger.create('text');
    const answerLogger = AwesomeLogger.create('text');
    const multiLogger = AwesomeLogger.create('multi', { children: [questionLogger, answerLogger] });
    super(multiLogger);
    this._text = config.text ?? '';
    this._currentAnswer = '';
    this._autoComplete = config.autoComplete
      ? Array.isArray(config.autoComplete)
        ? config.autoComplete
        : [config.autoComplete]
      : [];
    this._fuzzyAutoComplete = config.fuzzyAutoComplete ?? false;
    this._caseInsensitive = config.caseInsensitive ?? false;
    this._questionLogger = questionLogger;
    this._answerLogger = answerLogger;
    this._validator = config.validator ?? (() => true);
    this._default = config.default ?? '';
    this._cursorPos = 0;
  }

  private fuzzyMatch(possibleValue: string, input: string) {
    const regexPattern = `.*${input.split('').join('.*')}.*`;
    const re = new RegExp(regexPattern, this._caseInsensitive ? 'i' : undefined);
    return re.test(possibleValue);
  }

  private findPartialMatch(input: string, possibilities: string[]) {
    if (this._fuzzyAutoComplete) {
      return possibilities.find(x => this.fuzzyMatch(x, input));
    }

    if (this._caseInsensitive) {
      return possibilities.find(x => x.toLowerCase().startsWith(input.toLowerCase()));
    }
    return possibilities.find(x => x.startsWith(input));
  }

  private getAnswerText(): string {
    let autoCompleteMatch: string | null = null;
    let cursorRendered = false;

    if (this._fuzzyAutoComplete && this._autoComplete.length > 0) {
      const match = this.findPartialMatch(this._currentAnswer, this._autoComplete);
      if (match && this._currentAnswer !== match) {
        autoCompleteMatch = chalk.gray(` (${match})`);
      }
    } else if (this._autoComplete.length > 0) {
      const match = this.findPartialMatch(this._currentAnswer, this._autoComplete);
      if (match) {
        if (this._cursorPos < this._currentAnswer.length || this._cursorPos === match.length) {
          autoCompleteMatch = chalk.gray(match.substr(this._currentAnswer.length));
        } else {
          const relativeCurserPos = this._cursorPos - this._currentAnswer.length;
          const autoCompletePart = match.substr(this._currentAnswer.length);
          autoCompleteMatch = chalk.gray(
            `${autoCompletePart.substr(0, relativeCurserPos)}${chalk.bgWhite(
              autoCompletePart.substring(relativeCurserPos, relativeCurserPos + 1)
            )}${autoCompletePart.substring(relativeCurserPos + 1)}`
          );
          cursorRendered = true;
        }
      }
    }

    let answerText: string;
    if (cursorRendered) {
      answerText = this._currentAnswer;
    } else {
      // The cursor needs to be able to be located one character after the entered test, therefor we need to add a space at the end in case the cursor is at the end.
      // If fuzzy match is activated there is text rendered after the actual user input. To prevent it from jumping around the additional space char is always rendered.
      const currentAnswer = `${this._currentAnswer}${
        this._cursorPos === this._currentAnswer.length || this._fuzzyAutoComplete ? ' ' : ''
      }`;

      answerText = chalk.gray(
        `${currentAnswer.substring(0, this._cursorPos)}${chalk.bgWhite(
          currentAnswer.substring(this._cursorPos, this._cursorPos + 1)
        )}${currentAnswer.substring(this._cursorPos + 1)}`
      );
    }

    if (autoCompleteMatch) {
      answerText += autoCompleteMatch;
    }
    return answerText;
  }

  public init() {
    this._questionLogger.setText(this._text);
    if (this._autoComplete.length > 0) {
      this._answerLogger.setText(this.getAnswerText());
    } else {
      this._answerLogger.setText(chalk.gray('type your answer here...'));
    }
  }

  public gotKey(key: string): void {
    if (key.match(/^[\r\n]+$/)) {
      if (this._validator(this._currentAnswer)) {
        this.inputFinished(this._currentAnswer);
      } else {
        const ans = `${this.getAnswerText()} ${chalk.red('(invalid)')}`;
        this._answerLogger.setText(ans);
      }
      return;
    } else if (key === '\b') {
      if (this._currentAnswer.length > 0) {
        if (this._cursorPos > 0) {
          this._currentAnswer =
            this._currentAnswer.substr(0, this._cursorPos - 1) + this._currentAnswer.substring(this._cursorPos);
          this._cursorPos--;
        }
      }
    } else if (key === '\t') {
      const fittingAutocomplete = this.findPartialMatch(this._currentAnswer, this._autoComplete);
      if (fittingAutocomplete) {
        this._currentAnswer = fittingAutocomplete;
        this._cursorPos = this._currentAnswer.length;
      }
    } else if (!key.includes(CONTROL_PREFIX) && key.match(/^.+$/)) {
      this._currentAnswer =
        this._currentAnswer.substring(0, this._cursorPos) + key + this._currentAnswer.substring(this._cursorPos);
      this._cursorPos += key.length;
    } else if (key === KEY_ARROW_LEFT) {
      if (this._cursorPos > 0) {
        this._cursorPos--;
      }
    } else if (key === KEY_ARROW_RIGHT) {
      if (this._cursorPos < this._currentAnswer.length) {
        this._cursorPos++;
      }
    }
    this._answerLogger.setText(this.getAnswerText());
  }

  protected prepareResultLogger(): void {
    const resultLog = `${chalk.gray(' - Input: ')}${chalk.green(this._currentAnswer)}`;
    this.setLogger(AwesomeLogger.create('text', { text: resultLog }));
  }

  public needsScroll(): boolean {
    return true;
  }
}
