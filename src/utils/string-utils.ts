import cliTruncate from 'cli-truncate';
import sliceAnsi from 'slice-ansi';
import stripAnsi from 'strip-ansi';
import { TextObject } from '../models/text-object';

export class StringUtils {
  // public static trimLines(newLines: string[], oldLines?: string[]): (string | undefined)[] {
  //   const result: (string | undefined)[] = [];
  //   for (let i = 0; i < newLines.length; i++) {
  //     let newLine: string = newLines[i];
  //     const oldLine: string | undefined = oldLines?.[i];

  //     const changedLength = this.calculateChangedLength(newLine, oldLine);

  //     while (changedLength > TextObject.lineWidth(newLine)) {
  //       newLine += ' ';
  //     }

  //     if (changedLength !== 0) {
  //       const changedNewString = sliceAnsi(newLine, 0, changedLength);
  //       result.push(cliTruncate(changedNewString, process.stdout.columns));
  //     } else {
  //       result.push(undefined);
  //     }
  //   }
  //   return result;
  // }

  // public static calculateChangedLength(newString: string, lastString?: string): number {
  //   const newStrWidth = TextObject.lineWidth(newString);
  //   if (!lastString) {
  //     return newStrWidth;
  //   }
  //   const lastStrWidth = TextObject.lineWidth(lastString);

  //   if (newStrWidth > lastStrWidth) {
  //     return newStrWidth;
  //   }

  //   if (lastStrWidth > newStrWidth) {
  //     return lastStrWidth;
  //   }

  //   let unequalChars = 0;
  //   const strippedLastStr = stripAnsi(lastString);
  //   const strippedNewStr = stripAnsi(newString);
  //   for (let i = 0; i < lastStrWidth; i++) {
  //     const lastChar = strippedLastStr[i];
  //     const newCharChar = strippedNewStr[i];
  //     if (lastChar !== newCharChar) {
  //       unequalChars = i + 1;
  //     }
  //   }
  //   return unequalChars;
  // }
}
