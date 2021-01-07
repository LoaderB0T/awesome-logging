import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeLoggerTextControl } from '../../logger/models/config/text';
import { TextObject } from '../../models/text-object';
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
  private _currentAnswer: string;
  private _cursorPos: number;

  constructor(config: Partial<AwesomePromptTextConfig>) {
    const questionLogger = AwesomeLogger.create('text');
    const answerLogger = AwesomeLogger.create('text');
    super([questionLogger, answerLogger]);
    this._text = config.text ?? '';
    this._currentAnswer = '';
    this._autoComplete = config.autoComplete ? Array.isArray(config.autoComplete) ? config.autoComplete : [config.autoComplete] : [];
    this._fuzzyAutoComplete = config.fuzzyAutoComplete ?? false;
    this._questionLogger = questionLogger;
    this._answerLogger = answerLogger;
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

  private getAnswerText(): TextObject {
    let autoCompleteMatch: TextObject | null = null;
    let cursorRendered = false;


    if (this._fuzzyAutoComplete && this._autoComplete.length > 0) {
      const match = this.findPartialMatch(this._currentAnswer, this._autoComplete);
      if (match && this._currentAnswer !== match) {
        autoCompleteMatch = new TextObject(' (', 'GRAY');
        autoCompleteMatch.append(match, 'GRAY');
        autoCompleteMatch.append(')', 'GRAY');
      }
    } else if (this._autoComplete.length > 0) {
      const match = this.findPartialMatch(this._currentAnswer, this._autoComplete);
      if (match) {
        if (this._cursorPos < this._currentAnswer.length || this._cursorPos === match.length) {
          autoCompleteMatch = new TextObject(match.substr(this._currentAnswer.length), 'GRAY');
        } else {
          const relativeCurserPos = this._cursorPos - this._currentAnswer.length;
          const autoCompletePart = match.substr(this._currentAnswer.length);
          autoCompleteMatch = new TextObject(autoCompletePart.substr(0, relativeCurserPos), 'GRAY');
          autoCompleteMatch.append(autoCompletePart.substring(relativeCurserPos, relativeCurserPos + 1), 'GRAY', 'WHITE');
          autoCompleteMatch.append(autoCompletePart.substring(relativeCurserPos + 1), 'GRAY');
          cursorRendered = true;
        }
      }
    }

    let textObject: TextObject;
    if (cursorRendered) {
      textObject = new TextObject(this._currentAnswer);
    } else {
      // The cursor needs to be able to be located one character after the entered test, therefor we need to add a space at the end in case the cursor is at the end.
      // If fuzzy match is activated there is text rendered after the actual user input. To prevent it from jumping around the additional space char is always rendered.
      const currentAnswer = `${this._currentAnswer}${this._cursorPos === this._currentAnswer.length || this._fuzzyAutoComplete ? ' ' : ''}`;
      textObject = new TextObject(currentAnswer.substring(0, this._cursorPos));
      textObject.append(currentAnswer.substring(this._cursorPos, this._cursorPos + 1), 'BLACK', 'WHITE');
      textObject.append(currentAnswer.substring(this._cursorPos + 1));

    }
    if (autoCompleteMatch) {
      textObject.append(autoCompleteMatch);
    }
    return textObject;
  }

  public init() {
    this._questionLogger.setText(this._text);
    if (this._autoComplete.length > 0) {
      this._answerLogger.setText(this.getAnswerText());
    } else {
      this._answerLogger.setText({ text: 'type your answer here...', color: 'GRAY' });
    }
  }

  protected gotKey(key: string): void {
    if (key.match(/^[\r\n]+$/)) {
      this.inputFinished(this._currentAnswer);
      return;
    } else if (key === '\b') {
      if (this._currentAnswer.length > 0) {
        if (this._cursorPos > 0) {
          this._currentAnswer = this._currentAnswer.substr(0, this._cursorPos - 1) + this._currentAnswer.substring(this._cursorPos);
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
      this._currentAnswer = this._currentAnswer.substring(0, this._cursorPos) + key + this._currentAnswer.substring(this._cursorPos);
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

  protected resetViewAndShowResult(): void {
    const resultLog = new TextObject(' - Entered Text: ', 'GRAY');
    resultLog.append(this._currentAnswer, 'GREEN');
    this.multiLogger.getChild<AwesomeLoggerTextControl>(0).setText(resultLog);
  }
}
