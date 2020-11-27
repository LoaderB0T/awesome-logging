import stringWidth from 'string-width';
import { colorize, AwesomeLoggerColor } from '../types/logger-color';

export interface TextValue {
  text: string;
  color?: AwesomeLoggerColor;
}

export class TextObject {
  private readonly _values: TextValue[];
  private _child?: TextObject;

  constructor(text: string, color?: AwesomeLoggerColor) {
    this._values = [{ text, color }];
  }

  public static create(text: string | TextObject | TextValue): TextObject {
    if (typeof text === 'string') {
      return new TextObject(text);
    }
    if (text instanceof TextObject) {
      return text;
    }
    return new TextObject(text.text, text.color);
  }

  public static ensureTextValue(text: string | TextValue): TextValue {
    if (typeof text === 'string') {
      return { text };
    }
    return { text: text.text, color: text.color };
  }

  public append(text: string, color?: AwesomeLoggerColor): TextObject {
    this._values.push({ text, color });
    return this;
  }

  public appendLine(child: TextObject): TextObject {
    this._child = child;
    return this._child;
  }

  public toString(): string {
    let res = '';
    res += this._values.map(x => colorize(x.color)(x.text)).join('');
    if (this._child) {
      res += `\n${this._child.toString()}`;
    }
    return res;
  }

  public width() {
    const lineStr = this.toString();
    return stringWidth(lineStr);
  }

  public lineCount(): number {
    const str = this.toString();
    return str.split(/\r\n|\r|\n/).length;
  }
}
