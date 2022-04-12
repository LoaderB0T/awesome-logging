import { AwesomeLogger } from './awesome-logger';
import { Terminal } from 'node-terminal-simulator';
import { stdout } from 'process';
import { Stdout } from './render/stdout';

const t = new Terminal([100, 8]);
const originalWrite = (text: string) => stdout.write(text);
t.redirectStdout(Stdout.getInstance());

setInterval(() => {
  originalWrite(`\n\n${t.getStyledText()}`);
}, 100);

AwesomeLogger.prompt('choice', {
  text: 'Pick one!',
  options: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']
}).result.then(r => {
  console.log(r);
});
