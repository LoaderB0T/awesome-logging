import { AwesomeLoggerBase } from '../../logger-base.js';

export interface AwesomeLoggerMultiConfig {
  /**
   * A list of previously defined loggers to log them at the same time.
   */
  children: AwesomeLoggerBase[];
}

export interface AwesomeLoggerMultiControl extends AwesomeLoggerBase {
  /**
   * Returns one of the children loggers.
   * @param index The index of the child logger.
   */
  getChild<T extends AwesomeLoggerBase>(index: number): T;
}
