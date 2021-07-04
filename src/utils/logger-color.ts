import chalk from 'chalk';

export type AwesomeLoggerColor = 'WHITE' | 'BLACK' | 'RED' | 'GREEN' | 'YELLOW' | 'BLUE' | 'MAGENTA' | 'CYAN' | 'GRAY';

const colorizeBg = (bgColor?: AwesomeLoggerColor) => {
  switch (bgColor) {
    case 'WHITE':
      return chalk.bgWhite as (val: string) => string;
    case 'BLACK':
      return chalk.bgBlack as (val: string) => string;
    case 'RED':
      return chalk.bgRed as (val: string) => string;
    case 'GREEN':
      return chalk.bgGreen as (val: string) => string;
    case 'YELLOW':
      return chalk.bgYellow as (val: string) => string;
    case 'BLUE':
      return chalk.bgBlue as (val: string) => string;
    case 'MAGENTA':
      return chalk.bgMagenta as (val: string) => string;
    case 'CYAN':
      return chalk.bgCyan as (val: string) => string;
    case 'GRAY':
      return chalk.bgGray as (val: string) => string;
    default:
      return (a: string) => a;
  }
};

const colorizeFg = (color?: AwesomeLoggerColor) => {
  switch (color) {
    case 'WHITE':
      return chalk.white as (val: string) => string;
    case 'BLACK':
      return chalk.black as (val: string) => string;
    case 'RED':
      return chalk.red as (val: string) => string;
    case 'GREEN':
      return chalk.green as (val: string) => string;
    case 'YELLOW':
      return chalk.yellow as (val: string) => string;
    case 'BLUE':
      return chalk.blue as (val: string) => string;
    case 'MAGENTA':
      return chalk.magenta as (val: string) => string;
    case 'CYAN':
      return chalk.cyan as (val: string) => string;
    case 'GRAY':
      return chalk.gray as (val: string) => string;
    default:
      return (a: string) => a;
  }
};

export const colorize = (color?: AwesomeLoggerColor, bgColor?: AwesomeLoggerColor): ((val: string) => string) => {
  return (str: string) => colorizeFg(color)(colorizeBg(bgColor)(str));
};
