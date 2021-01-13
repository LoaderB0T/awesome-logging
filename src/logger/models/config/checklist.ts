export interface AwesomeChecklistLoggerItem {
  state: AwesomeChecklistLoggerState;
  text: string;
}

export type AwesomeChecklistLoggerState =
  'unknown' |
  'pending' |
  'inProgress' |
  'done' |
  'succeeded' |
  'failed' |
  'skipped' |
  'partiallySucceeded';

export interface AwesomeChecklistLoggerConfig {
  items: AwesomeChecklistLoggerItem[];
}

export interface AwesomeChecklistLoggerControl {
  changeState(index: number, state: AwesomeChecklistLoggerState, newText?: string): void;
}
