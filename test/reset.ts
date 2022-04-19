import { Terminal } from 'node-terminal-simulator';
import { LoggerManager } from '../src/logger/logger-manager.js';
import { Stdout } from '../src/render/stdout.js';

export class TestInit {
  static getTerminal(): Terminal {
    const t = new Terminal([100, 6]);
    t.redirectStdout(Stdout.getInstance());
    LoggerManager.getInstance()._reset();
    return t;
  }
}
