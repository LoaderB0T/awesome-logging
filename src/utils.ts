const controlPrefix: string = "\u001b[";

export const MOVE_LEFT = () => process.stdout.write(`${controlPrefix}1000D`);
export const MOVE_UP = (i: number) => i > 0 ? process.stdout.write(`${controlPrefix}${i}A`) : {};
export const MOVE_DOWN = (i: number) => i > 0 ? process.stdout.write(`${controlPrefix}${i}B`) : {};
export const INSERT_LINE = () => process.stdout.write('\n');
export const INSERT_NEW_LINE = () => process.stdout.write(`${controlPrefix}1L`);
export const DELETE_LINE = () => process.stdout.write(`${controlPrefix}1M`);
export const CLEAR_LINE = () => process.stdout.write(`${controlPrefix}0K`);

export const HIDE_CURSOR = () => process.stdout.write(`${controlPrefix}?25l`);
export const SHOW_CURSOR = () => process.stdout.write(`${controlPrefix}?25h`);

export const START_BLINK_CURSOR = () => process.stdout.write(`${controlPrefix}?12h`);
export const STOP_BLINK_CURSOR = () => process.stdout.write(`${controlPrefix}?12l`);

export const SAVE_CURSOR = () => process.stdout.write(`${controlPrefix}s`);
export const RESTORE_CURSOR = () => process.stdout.write(`${controlPrefix}u`);
