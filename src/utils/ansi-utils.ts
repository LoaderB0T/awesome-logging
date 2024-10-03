import restoreCursor from 'restore-cursor';

import { Stdout } from '../render/stdout.js';
restoreCursor();

// @internal
export const CONTROL_PREFIX_FIRST_CHAR: string = '\u001b';
export const CONTROL_PREFIX: string = `${CONTROL_PREFIX_FIRST_CHAR}[`;

let cursorVisible = true;
const debug = false;

// @internal
export const MOVE_LEFT = () => Stdout.getInstance().write(`${CONTROL_PREFIX}1000D`);
// @internal
export const MOVE_UP = (i: number = 1) => (i > 0 ? Stdout.getInstance().write(`${CONTROL_PREFIX}${i}A`) : {});
// @internal
export const MOVE_DOWN = (i: number = 1) => (i > 0 ? Stdout.getInstance().write(`${CONTROL_PREFIX}${i}B`) : {});
// @internal
export const INSERT_LINE = () => Stdout.getInstance().write('\n');
// @internal
export const INSERT_NEW_LINE = () => Stdout.getInstance().write(`${CONTROL_PREFIX}1L`);
// @internal
export const DELETE_LINE = () => Stdout.getInstance().write(`${CONTROL_PREFIX}1M`);
// @internal
export const CLEAR_LINE = () => Stdout.getInstance().write(`${CONTROL_PREFIX}0K`);

// @internal
export const HIDE_CURSOR = () => {
  if (debug) {
    return;
  }
  if (cursorVisible) {
    Stdout.getInstance().write(`${CONTROL_PREFIX}?25l`);
    cursorVisible = false;
  }
};
// @internal
export const SHOW_CURSOR = () => {
  if (!cursorVisible) {
    Stdout.getInstance().write(`${CONTROL_PREFIX}?25h`);
    cursorVisible = true;
  }
};
// @internal
export const START_BLINK_CURSOR = () => Stdout.getInstance().write(`${CONTROL_PREFIX}?12h`);
// @internal
export const STOP_BLINK_CURSOR = () => Stdout.getInstance().write(`${CONTROL_PREFIX}?12l`);
// @internal
export const SAVE_CURSOR = () => Stdout.getInstance().write(`${CONTROL_PREFIX}s`);
// @internal
export const RESTORE_CURSOR = () => Stdout.getInstance().write(`${CONTROL_PREFIX}u`);

// @internal
export const KEY_ARROW_UP = `${CONTROL_PREFIX}A`;
// @internal
export const KEY_ARROW_DOWN = `${CONTROL_PREFIX}B`;
// @internal
export const KEY_ARROW_RIGHT = `${CONTROL_PREFIX}C`;
// @internal
export const KEY_ARROW_LEFT = `${CONTROL_PREFIX}D`;
