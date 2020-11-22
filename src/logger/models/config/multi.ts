import { AwesomeLoggerBase } from '../logger-base';

export interface AwesomeLoggerMultiConfig {
  children: AwesomeLoggerBase[];
}

export interface AwesomeLoggerMultiControl extends AwesomeLoggerBase {
  getChild<T extends AwesomeLoggerBase>(index: number): T;
}
