import { AwesomeLoggerBase } from '../../logger-base';

export interface AwesomeChecklistLoggerItem {
  /**
   * The state of the checklist item.
   */
  state: AwesomeChecklistLoggerState;
  /**
   * The text of the checklist item.
   */
  text: string;
}

export type AwesomeChecklistLoggerState =
  | 'unknown'
  | 'pending'
  | 'inProgress'
  | 'done'
  | 'succeeded'
  | 'failed'
  | 'skipped'
  | 'partiallySucceeded';

export interface AwesomeChecklistLoggerConfig {
  /**
   * The items of the checklist.
   */
  items: AwesomeChecklistLoggerItem[];
}

export interface AwesomeChecklistLoggerControl extends AwesomeLoggerBase {
  /**
   * Changes the state of a checklist item.
   * @param index The index of the checklist item.
   * @param state The new state of the checklist item.
   * @param newText (optional) The new text of the checklist item.
   */
  changeState(index: number, state: AwesomeChecklistLoggerState, newText?: string): void;
}
