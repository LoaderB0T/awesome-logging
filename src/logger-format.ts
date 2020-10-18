import { LoggerColor } from './logger-color';

export class LoggerFormat {
  private readonly _prefix: string;
  private readonly _prefixColor: LoggerColor;
  private readonly _messageColor: LoggerColor;

  constructor(prefix?: string, prefixColor?: LoggerColor, messageColor?: LoggerColor) {
    this._prefix = prefix ?? '';
    this._prefixColor = prefixColor ?? 'WHITE';
    this._messageColor = messageColor ?? 'WHITE';
  }
}
