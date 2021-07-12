import { Terminal } from 'node-terminal-emulator';
import { LoggerManager } from '../src/logger/logger-manager';
import { Stdout } from '../src/render/stdout';

export class TestInit {
  static getTerminal(): Terminal {
    const t = new Terminal([100, 6]);
    t.redirectStdout(Stdout.getInstance());
    LoggerManager['_instance'] = undefined;
    return t;
  }
}
