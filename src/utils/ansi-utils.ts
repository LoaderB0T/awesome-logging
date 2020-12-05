import restoreCursor from 'restore-cursor';
restoreCursor();

export const CONTROL_PREFIX: string = '\u001b[';

let cursorVisible = true;

export const MOVE_LEFT = () => process.stdout.write(`${CONTROL_PREFIX}1000D`);
export const MOVE_UP = (i: number) => i > 0 ? process.stdout.write(`${CONTROL_PREFIX}${i}A`) : {};
export const MOVE_DOWN = (i: number) => i > 0 ? process.stdout.write(`${CONTROL_PREFIX}${i}B`) : {};
export const INSERT_LINE = () => process.stdout.write('\n');
export const INSERT_NEW_LINE = () => process.stdout.write(`${CONTROL_PREFIX}1L`);
export const DELETE_LINE = () => process.stdout.write(`${CONTROL_PREFIX}1M`);
export const CLEAR_LINE = () => process.stdout.write(`${CONTROL_PREFIX}0K`);

export const HIDE_CURSOR = () => {
  if (cursorVisible) {
    process.stdout.write(`${CONTROL_PREFIX}?25l`);
    cursorVisible = false;
  }
};
export const SHOW_CURSOR = () => {
  if (!cursorVisible) {
    process.stdout.write(`${CONTROL_PREFIX}?25h`);
    cursorVisible = true;
  }
};

export const START_BLINK_CURSOR = () => process.stdout.write(`${CONTROL_PREFIX}?12h`);
export const STOP_BLINK_CURSOR = () => process.stdout.write(`${CONTROL_PREFIX}?12l`);

export const SAVE_CURSOR = () => process.stdout.write(`${CONTROL_PREFIX}s`);
export const RESTORE_CURSOR = () => process.stdout.write(`${CONTROL_PREFIX}u`);

export const KEY_ARROW_UP = `${CONTROL_PREFIX}A`;
export const KEY_ARROW_DOWN = `${CONTROL_PREFIX}B`;
export const KEY_ARROW_RIGHT = `${CONTROL_PREFIX}C`;
export const KEY_ARROW_LEFT = `${CONTROL_PREFIX}D`;
