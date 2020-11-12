import { LineLogger } from '../line-logger/line-logger';
import { MultilineLogger } from './multiline-logger';

export class SimpleMultilineLogger extends MultilineLogger {
  constructor(lineLogger: LineLogger[]) {
    super(lineLogger);
  }
}
