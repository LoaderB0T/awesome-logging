import chalk from 'chalk';
import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeLoggerTextControl } from '../../logger/models/config/text';
import { CONTROL_PREFIX, KEY_ARROW_LEFT, KEY_ARROW_RIGHT } from '../../utils/ansi-utils';
import { AwesomePromptTextConfig, AwesomePromptTextControl } from './config/text';
import { AwesomePromptBase } from '../prompt-base';

export class AwesomeTextPromt extends AwesomePromptBase<string> implements AwesomePromptTextControl {
  private readonly _questionLogger: AwesomeLoggerTextControl;
  private readonly _answerLogger: AwesomeLoggerTextControl;
  private readonly _cfg: AwesomePromptTextConfig;
  private readonly _hints: string[];
  private _currentAnswer: string;
  private _cursorPos: number;

  constructor(config: Partial<AwesomePromptTextConfig>) {
    const questionLogger = AwesomeLogger.create('text');
    const answerLogger = AwesomeLogger.create('text');
    const multiLogger = AwesomeLogger.create('multi', { children: [questionLogger, answerLogger] });
    super(multiLogger);
    this._cfg = {
      allowOnlyHints: config.allowOnlyHints ?? false,
      text: config.text ?? '',
      caseInsensitive: config.caseInsensitive ?? false,
      default: config.default ?? '',
      fuzzyAutoComplete: config.fuzzyAutoComplete ?? false,
      hints: config.hints ? (Array.isArray(config.hints) ? config.hints : [config.hints]) : [],
      validator: config.validator ?? (() => true)
    };
    this._hints = this._cfg.hints as string[];

    this._currentAnswer = '';
    this._questionLogger = questionLogger;
    this._answerLogger = answerLogger;
    this._cursorPos = 0;
  }

  private fuzzyMatch(possibleValue: string, input: string) {
    const regexPattern = `.*${input.split('').join('.*')}.*`;
    const re = new RegExp(regexPattern, this._cfg.caseInsensitive ? 'i' : undefined);
    return re.test(possibleValue);
  }

  private findPartialMatch(input: string, possibilities: string[]) {
    if (this._cfg.fuzzyAutoComplete) {
      return possibilities.find(x => this.fuzzyMatch(x, input));
    }

    if (this._cfg.caseInsensitive) {
      return possibilities.find(x => x.toLowerCase().startsWith(input.toLowerCase()));
    }
    return possibilities.find(x => x.startsWith(input));
  }

  private getAnswerText(): string {
    let autoCompleteMatch: string | null = null;
    let cursorRendered = false;

    if (this._cfg.fuzzyAutoComplete && this._hints.length > 0) {
      autoCompleteMatch = this.getFuzzyAutocompleteMatch(autoCompleteMatch);
    } else if (this._hints.length > 0) {
      ({ autoCompleteMatch, cursorRendered } = this.getAutocompleteMatch(autoCompleteMatch, cursorRendered));
    }

    let answerText: string;
    if (cursorRendered) {
      answerText = this._currentAnswer;
    } else {
      // The cursor needs to be able to be located one character after the entered test, therefor we need to add a space at the end in case the cursor is at the end.
      // If fuzzy match is activated there is text rendered after the actual user input. To prevent it from jumping around the additional space char is always rendered.
      const currentAnswer = `${this._currentAnswer}${
        this._cursorPos === this._currentAnswer.length || this._cfg.fuzzyAutoComplete ? ' ' : ''
      }`;

      answerText = chalk.gray(
        currentAnswer.substring(0, this._cursorPos) +
          chalk.bgWhite(currentAnswer.substring(this._cursorPos, this._cursorPos + 1)) +
          currentAnswer.substring(this._cursorPos + 1)
      );
    }

    if (autoCompleteMatch) {
      answerText += autoCompleteMatch;
    }
    return answerText;
  }

  private getAutocompleteMatch(autoCompleteMatch: string | null, cursorRendered: boolean) {
    const match = this.findPartialMatch(this._currentAnswer, this._hints);
    if (match) {
      if (this._cursorPos < this._currentAnswer.length || this._cursorPos === match.length) {
        autoCompleteMatch = chalk.gray(match.substring(this._currentAnswer.length));
      } else {
        const relativeCurserPos = this._cursorPos - this._currentAnswer.length;
        const autoCompletePart = match.substring(this._currentAnswer.length);
        autoCompleteMatch = chalk.gray(
          `${autoCompletePart.substring(0, relativeCurserPos)}${chalk.bgWhite(
            autoCompletePart.substring(relativeCurserPos, relativeCurserPos + 1)
          )}${autoCompletePart.substring(relativeCurserPos + 1)}`
        );
        cursorRendered = true;
      }
    }
    return { autoCompleteMatch, cursorRendered };
  }

  private getFuzzyAutocompleteMatch(autoCompleteMatch: string | null) {
    const match = this.findPartialMatch(this._currentAnswer, this._hints);
    if (match && this._currentAnswer !== match) {
      autoCompleteMatch = chalk.gray(` (${match})`);
    }
    return autoCompleteMatch;
  }

  public init() {
    this._questionLogger.setText(this._cfg.text);
    if (this._hints.length > 0) {
      this._answerLogger.setText(this.getAnswerText());
    } else {
      this._answerLogger.setText(chalk.gray('type your answer here...'));
    }
  }

  private isValid(ans: string): boolean {
    if (this._cfg.allowOnlyHints) {
      if (!this._hints.some(x => x === ans)) {
        return false;
      }
    }
    if (!this._cfg.validator(ans)) {
      return false;
    }

    return true;
  }

  public getCurrentAnswer(): string | undefined {
    return this.isValid(this._currentAnswer) ? this._currentAnswer : undefined;
  }

  public gotKey(key: string): void {
    if (key.match(/^[\r\n]+$/)) {
      this.gotEnterKey();
      return;
    } else if (key === '\b') {
      this.gotBackspaceKey();
    } else if (key === '\t') {
      this.gotTabKey();
    } else if (!key.includes(CONTROL_PREFIX) && key.match(/^.+$/)) {
      this.gotPrintableCharacterKey(key);
    } else if (key === KEY_ARROW_LEFT) {
      this.gotLeftKey();
    } else if (key === KEY_ARROW_RIGHT) {
      this.gotRightKey();
    }
    this._answerLogger.setText(this.getAnswerText());
  }

  private gotRightKey() {
    if (this._cursorPos < this._currentAnswer.length) {
      this._cursorPos++;
    }
  }

  private gotLeftKey() {
    if (this._cursorPos > 0) {
      this._cursorPos--;
    }
  }

  private gotPrintableCharacterKey(key: string) {
    this._currentAnswer =
      this._currentAnswer.substring(0, this._cursorPos) + key + this._currentAnswer.substring(this._cursorPos);
    this._cursorPos += key.length;
  }

  private gotTabKey() {
    const fittingAutocomplete = this.findPartialMatch(this._currentAnswer, this._hints);
    if (fittingAutocomplete) {
      this._currentAnswer = fittingAutocomplete;
      this._cursorPos = this._currentAnswer.length;
    }
  }

  private gotBackspaceKey() {
    if (this._currentAnswer.length > 0) {
      if (this._cursorPos > 0) {
        this._currentAnswer =
          this._currentAnswer.substring(0, this._cursorPos - 1) + this._currentAnswer.substring(this._cursorPos);
        this._cursorPos--;
      }
    }
  }

  private gotEnterKey() {
    if (this.isValid(this._currentAnswer)) {
      this.inputFinished(this._currentAnswer);
    } else {
      const ans = `${this.getAnswerText()} ${chalk.red('(invalid)')}`;
      this._answerLogger.setText(ans);
    }
  }

  protected prepareResultLogger(): void {
    const resultLog = `${chalk.gray(' - Input: ')}${chalk.green(this._currentAnswer)}`;
    this.setLogger(AwesomeLogger.create('text', { text: resultLog }));
  }

  public needsScroll(): boolean {
    return true;
  }
}
