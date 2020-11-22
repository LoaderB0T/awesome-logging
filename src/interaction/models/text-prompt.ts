import { AwesomeLogger } from '../../awesome-logger';
import { AwesomeLoggerTextControl } from '../../logger/models/config/text';
import { AwesomePromptTextConfig, AwesomePromptTextControl } from './config/text';
import { AwesomePromptBase } from './prompt-base';

export class AwesomeTextPromt extends AwesomePromptBase implements AwesomePromptTextControl {
  private readonly _questionLogger: AwesomeLoggerTextControl;
  private readonly _answerLogger: AwesomeLoggerTextControl;
  private _currentAnswer: string;

  constructor(config: Partial<AwesomePromptTextConfig>) {
    const a = AwesomeLogger.create('text', { text: config.text });
    const b = AwesomeLogger.create('text', { text: { text: 'Type your answer here...', color: 'GRAY' } });
    super([a, b]);
    this._currentAnswer = '';
    this._questionLogger = a;
    this._answerLogger = b;
  }

  protected gotKey(key: string): void {
    if (key.match(/[\r\n]+/)) {
      this.inputFinished();
    } else {
      this._currentAnswer += key;
      this._answerLogger.setText(this._currentAnswer);
    }
  }
}
