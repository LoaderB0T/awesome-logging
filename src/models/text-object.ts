import sliceAnsi from 'slice-ansi';
import stringWidth from 'string-width';
import { colorize, AwesomeLoggerColor } from '../types/logger-color';

export interface TextValue {
  text: string;
  color?: AwesomeLoggerColor;
  bgColor?: AwesomeLoggerColor;
}

export class TextObject {
  private readonly _values: TextValue[];
  private _child?: TextObject;
  private _empty: boolean;

  public static empty: TextObject = new TextObject('').empty();

  constructor(text: string, color?: AwesomeLoggerColor, bgColor?: AwesomeLoggerColor) {
    const lines = text.split(/[\r\n]/g).filter(x => !!x);
    const firstLine = lines.splice(0, 1)[0] ?? '';
    this._values = [{ text: firstLine, color, bgColor }];
    if (lines.length > 0) {
      this._child = new TextObject(lines.join('\n'), color, bgColor);
    }
  }

  private empty() {
    this._empty = true;
    return this;
  }

  public static create(text: string | TextObject | TextValue): TextObject {
    if (typeof text === 'string') {
      return new TextObject(text);
    }
    if (text instanceof TextObject) {
      return text;
    }
    return new TextObject(text.text, text.color, text.bgColor);
  }

  public static ensureTextValue(text: string | TextValue): TextValue {
    if (typeof text === 'string') {
      return { text };
    }
    return { text: text.text, color: text.color, bgColor: text.bgColor };
  }

  public append(textObject: TextObject): TextObject
  public append(text: string, color?: AwesomeLoggerColor, bgColor?: AwesomeLoggerColor): TextObject
  public append(text?: TextObject | string, color?: AwesomeLoggerColor, bgColor?: AwesomeLoggerColor): TextObject {
    if (typeof text === 'string') {
      this._values.push({ text, color, bgColor });
    } else {
      text?._values.forEach(v => {
        this._values.push({ text: v.text, color: v.color, bgColor: v.bgColor });
      });
      if (text?._child) {
        let parent: TextObject = this;
        let child: TextObject | undefined = this._child;
        while (child) {
          parent = child;
          child = parent._child;
        }
        parent._child = text._child;
      }
    }
    return this;
  }

  public appendLine(child: TextObject): TextObject {
    this._child = child;
    return this._child;
  }

  public toLineString(lastText?: TextObject): string {
    let appendSpaces = '';
    const textLength = this.length;
    let newTextRenderLength = textLength;
    if (lastText) {
      const lastlength = lastText.length;
      if (lastlength > textLength) {
        appendSpaces = ' '.repeat(lastlength - textLength);
      } else if (lastlength === textLength) {
        newTextRenderLength = TextObject.calculateLastChangedCharacterIndex(lastText, this) + 1;
      }
    }
    let res = '';
    res += this._values.map(x => colorize(x.color, x.bgColor)(x.text)).join('');
    const changedText = (newTextRenderLength !== -1 ? sliceAnsi(res, 0, newTextRenderLength) : res) + appendSpaces;
    return changedText;
  }

  static calculateLastChangedCharacterIndex(oldText: TextObject, newText: TextObject): number {
    let lastChangeAt = -1;
    for (let i = 0; i < oldText.length; i++) {
      const oldChar = oldText.getCharAt(i);
      const newChar = newText.getCharAt(i);
      const oldColor = oldText.getColorAt(i);
      const newColor = newText.getColorAt(i);
      const oldColorBg = oldText.getBgColorAt(i);
      const newColorBg = newText.getBgColorAt(i);
      if (oldChar !== newChar || oldColor !== newColor || oldColorBg !== newColorBg) {
        lastChangeAt = i;
      }
    }
    return lastChangeAt;
  }

  private findIndices(i: number): [valueIndex: number, charIndex: number] {
    let counter = i;
    let valuesIndex = 0;
    let valuesArrValue = this._values[0];
    while (valuesArrValue.text.length < counter + 1) {
      counter -= valuesArrValue.text.length;
      valuesIndex++;
      valuesArrValue = this._values[valuesIndex];
      if (!valuesArrValue) {
        return [-1, -1];
      }
    }
    return [valuesIndex, counter];
  }

  public getColorAt(i: number): AwesomeLoggerColor | undefined {
    const [valueIndex] = this.findIndices(i);
    if (valueIndex === -1) {
      return undefined;
    }
    return this._values[valueIndex].color;
  }

  public getBgColorAt(i: number): AwesomeLoggerColor | undefined {
    const [valueIndex] = this.findIndices(i);
    if (valueIndex === -1) {
      return undefined;
    }
    return this._values[valueIndex].bgColor;
  }

  public getCharAt(i: number): string | undefined {
    const [valueIndex, charIndex] = this.findIndices(i);
    if (valueIndex === -1 || charIndex === -1) {
      return undefined;
    }
    return this._values[valueIndex].text[charIndex];
  }

  public get length(): number {
    return this._values.map(x => stringWidth(x.text)).reduce((a, b) => a + b);
  }

  public toString(): string {
    let res = '';
    res += this._values.map(x => colorize(x.color, x.bgColor)(x.text)).join('');
    if (this._child) {
      res += `\n${this._child.toString()}`;
    }
    return res;
  }

  public width() {
    const lineStr = this.toLineString();
    return stringWidth(lineStr);
  }

  public hasNextLine(): boolean {
    return !!this._child;
  }

  public nextLine(): TextObject | undefined {
    return this._child;
  }

  public allLines() {
    let nextLine: TextObject = this;
    const allLines: TextObject[] = [nextLine];

    while (nextLine.hasNextLine()) {
      nextLine = nextLine.nextLine()!;
      allLines.push(nextLine);
    }
    return allLines;
  }
}
