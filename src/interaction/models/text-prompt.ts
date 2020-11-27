import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeLoggerTextControl } from '../../logger/models/config/text';
import { TextObject } from '../../models/text-object';
import { AwesomePromptTextConfig, AwesomePromptTextControl } from './config/text';
import { AwesomePromptBase } from './prompt-base';

export class AwesomeTextPromt extends AwesomePromptBase implements AwesomePromptTextControl {
  private readonly _questionLogger: AwesomeLoggerTextControl;
  private readonly _answerLogger: AwesomeLoggerTextControl;
  private readonly _text: string;
  private readonly _caseInsensitive: boolean;
  private readonly _autoComplete: string[];
  private _currentAnswer: string;

  constructor(config: Partial<AwesomePromptTextConfig>) {
    const questionLogger = AwesomeLogger.create('text');
    const answerLogger = AwesomeLogger.create('text');
    super([questionLogger, answerLogger]);
    this._text = config.text ?? '';
    this._currentAnswer = '';
    this._autoComplete = config.autoComplete ? Array.isArray(config.autoComplete) ? config.autoComplete : [config.autoComplete] : [];
    this._questionLogger = questionLogger;
    this._answerLogger = answerLogger;
  }


  private findPartialMatch(input: string, possibilities: string[]) {
    if (this._caseInsensitive) {
      return possibilities.find(x => x.toLowerCase().startsWith(input.toLowerCase()));
    }
    return possibilities.find(x => x.startsWith(input));
  }

  private getAnswerText(): TextObject {
    if (this._autoComplete.length > 0) {
      const match = this.findPartialMatch(this._currentAnswer, this._autoComplete);
      if (match) {
        return new TextObject(this._currentAnswer).append(match.substr(this._currentAnswer.length), 'GRAY');
      }
    }
    return new TextObject(this._currentAnswer);
  }

  public init() {
    this._questionLogger.setText(this._text);
    if (this._autoComplete.length > 0) {
      this._answerLogger.setText({ text: this._autoComplete[0], color: 'GRAY' });
    } else {
      this._answerLogger.setText({ text: 'type your answer here...', color: 'GRAY' });
    }
  }

  protected gotKey(key: string): void {
    if (key.match(/[\r\n]+/)) {
      this.inputFinished();
      return;
    } else if (key === '\b') {
      if (this._currentAnswer.length > 0) {
        this._currentAnswer = this._currentAnswer.substr(0, this._currentAnswer.length - 1);
      }
    } else if (key === '\t') {
      const fittingAutocomplete = this.findPartialMatch(this._currentAnswer, this._autoComplete);
      if (fittingAutocomplete) {
        this._currentAnswer = fittingAutocomplete;
      }
    } else {
      this._currentAnswer += key;
    }
    this._answerLogger.setText(this.getAnswerText());
  }
}
