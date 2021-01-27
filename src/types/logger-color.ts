import chalk from 'chalk';

export type AwesomeLoggerColor = 'WHITE' | 'BLACK' | 'RED' | 'GREEN' | 'YELLOW' | 'BLUE' | 'MAGENTA' | 'CYAN' | 'GRAY';

const colorizeBg = (bgColor?: AwesomeLoggerColor) => {
  switch (bgColor) {
    case 'WHITE':
      return chalk.bgWhite;
    case 'BLACK':
      return chalk.bgBlack;
    case 'RED':
      return chalk.bgRed;
    case 'GREEN':
      return chalk.bgGreen;
    case 'YELLOW':
      return chalk.bgYellow;
    case 'BLUE':
      return chalk.bgBlue;
    case 'MAGENTA':
      return chalk.bgMagenta;
    case 'CYAN':
      return chalk.bgCyan;
    case 'GRAY':
      return chalk.bgGray;
    default:
      return (a: any) => a;
  }
};

export const colorizeFg = (color?: AwesomeLoggerColor) => {
  switch (color) {
    case 'WHITE':
      return chalk.white;
    case 'BLACK':
      return chalk.black;
    case 'RED':
      return chalk.red;
    case 'GREEN':
      return chalk.green;
    case 'YELLOW':
      return chalk.yellow;
    case 'BLUE':
      return chalk.blue;
    case 'MAGENTA':
      return chalk.magenta;
    case 'CYAN':
      return chalk.cyan;
    case 'GRAY':
      return chalk.gray;
    default:
      return (a: any) => a;
  }
};

export const colorize = (color?: AwesomeLoggerColor, bgColor?: AwesomeLoggerColor) => {
  return (str: string) => colorizeFg(color)(colorizeBg(bgColor)(str));
};
