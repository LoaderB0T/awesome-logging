import stringWidth from 'string-width';
import { colorize, AwesomeLoggerColor } from '../types/logger-color';

export class TextObject {
  text: string;
  color?: AwesomeLoggerColor;

  public static ensureString(line: string | TextObject | TextObject[]): string {
    const isArray = Array.isArray(line);
    const isObj = typeof line === 'object';
    if (!isObj && !isArray) {
      return line as string;
    }
    const lineObjArray = isArray ? line as TextObject[] : [line as TextObject];

    return lineObjArray.map(x => colorize(x.color)(x.text)).join('');
  }

  public static lineWidth(line: string | TextObject | TextObject[]) {
    const lineStr = this.ensureString(line);
    return stringWidth(lineStr);
  }

  public static ensureArray(text: string | TextObject | TextObject[]): TextObject[] {
    const isObj = typeof text === 'object';
    const isArray = Array.isArray(text);

    if (!isObj && !isArray) {
      return [{ text: text as string }];
    }

    const lineObjArray = isArray ? text as TextObject[] : [text as TextObject];

    return lineObjArray;
  }

  public static lineCount(text: string | TextObject | TextObject[]): number {
    const str = this.ensureString(text);
    return str.split(/\r\n|\r|\n/).length;
  }

  public static ensureObject(text: string | TextObject): TextObject {
    const isObj = typeof text === 'object';
    if (!isObj) {
      return { text: text as string };
    }
    return text as TextObject;
  }
}
