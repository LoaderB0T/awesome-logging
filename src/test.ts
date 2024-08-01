import { Stdout } from 'node-terminal-simulator';
import { AwesomeLogger } from './awesome-logger.js';
import { exec, spawn } from 'child_process';
import fs, { WriteStream } from 'fs';

AwesomeLogger.log('awd');
AwesomeLogger.log('awd2');
AwesomeLogger.log('awd3');
AwesomeLogger.interrupt('awdA');
AwesomeLogger.interrupt('awdB');
AwesomeLogger.interrupt('awdC');
AwesomeLogger.log('awd4');
AwesomeLogger.log('awd5');

let _originalStdout: typeof process.stdout.write;
function redirectStdout(stdout?: Stdout) {
  stdout ??= process.stdout;
  if ((stdout as any)['__node_terminal_simulator_redirected']) {
    restoreStdout(stdout);
  }
  (stdout as any)['__node_terminal_simulator_redirected'] = true;
  _originalStdout = stdout.write;
  stdout.write = (text: string) => _originalStdout.bind(stdout)(`${text}ye`);
}
function restoreStdout(stdout?: Stdout) {
  stdout ??= process.stdout;
  if (!(stdout as any)['__node_terminal_simulator_redirected']) {
    throw new Error('Stdout has not been redirected');
  }
  stdout.write = _originalStdout!;
  (stdout as any)['__node_terminal_simulator_redirected'] = undefined;
}

redirectStdout();

function runCmd(cmd: string) {
  return new Promise<void>(resolve => {
    const commandExec = spawn(cmd, {
      stdio: [null, 'pipe', 'pipe'],
      shell: true,
      windowsVerbatimArguments: true,

      cwd: 'D:/git/awdware3/web',
      env: {
        ...process.env,
        FORCE_COLOR: 'true',
      },
    });
    commandExec.on('close', () => {
      resolve();
    });
    commandExec.on('exit', () => {
      resolve();
    });
    commandExec.stdout.pipe(process.stdout);
  });
}
console.log(process.stdout.isTTY);
await runCmd('pnpm nx build home --no-cache --colors=true').then(() => {});
