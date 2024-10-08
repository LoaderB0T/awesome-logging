import { stdout } from 'process';

import { Terminal } from 'node-terminal-simulator';

import { AwesomeLogger } from './awesome-logger.js';
import { Stdout } from './render/stdout.js';

const t = new Terminal([100, 5]);
const originalWrite = (text: string) => stdout.write(text);
t.redirectStdout(Stdout.getInstance());

setInterval(() => {
  originalWrite(`\n\n${t.getStyledText()}`);
}, 100);

AwesomeLogger.prompt('choice', {
  text: 'Pick one!',
  options: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7', 'Option 8']
}).result.then(r => {
  console.log(r);
});
