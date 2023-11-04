import { AwesomeLoggerBase } from '../../logger-base.js';

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
  /**
   * Whether to log an additional line whenever the state of a checklist item changes to a final state (done, succeeded, failed, skipped, partiallySucceeded).
   * @default false
   */
  logAllFinalStates?: boolean;
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
