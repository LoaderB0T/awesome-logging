import chalk from 'chalk';

export type AwesomeLoggerColor = 'WHITE' | 'BLACK' | 'RED' | 'GREEN' | 'YELLOW' | 'BLUE' | 'MAGENTA' | 'CYAN' | 'GRAY';

export const colorize = (color?: AwesomeLoggerColor) => {
  switch (color) {
    case 'WHITE': return chalk.white;
    case 'BLACK': return chalk.black;
    case 'RED': return chalk.red;
    case 'GREEN': return chalk.green;
    case 'YELLOW': return chalk.yellow;
    case 'BLUE': return chalk.blue;
    case 'MAGENTA': return chalk.magenta;
    case 'CYAN': return chalk.cyan;
    case 'GRAY': return chalk.gray;
    default: return chalk.white;
  }
};
