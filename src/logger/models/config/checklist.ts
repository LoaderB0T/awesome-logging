export interface AwesomeChecklistLoggerItem {
  state: AwesomeChecklistLoggerState;
  text: string;
}

export enum AwesomeChecklistLoggerState {
  unknown = 0,
  pending = 1,
  inProgress = 2,
  done = 3,
  succeeded = 4,
  failed = 5,
  partiallySucceeded = 6
}

export interface AwesomeChecklistLoggerConfig {
  items: AwesomeChecklistLoggerItem[];
}

export interface AwesomeChecklistLoggerControl {
  changeState(index: number, state: AwesomeChecklistLoggerState, newText?: string): void;
}
