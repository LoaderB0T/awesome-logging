import chalk from 'chalk';

import { AwesomeLogger } from './awesome-logger.js';
import { AwesomeChecklistLoggerItem } from './logger/models/config/checklist.js';

AwesomeLogger.restrictedLogging = true;

AwesomeLogger.log('this is awesome logging!');

// const line1 = AwesomeLogger.create('text', { text: chalk.green('awd\nawd2awd3') });
// const prog1 = AwesomeLogger.create('progress', { totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
// const spin1 = AwesomeLogger.create('spinner', {
//   text: ' My text',
//   spinnerDelay: 75,
//   spinnerFrames: [chalk.magenta('▄'), chalk.magenta('■'), chalk.magenta('▀'), chalk.magenta('▀'), chalk.magenta('■')]
// });
// const line2 = AwesomeLogger.create('text', { text: chalk.green('awd\nawd2awd3') });
// const prog2 = AwesomeLogger.create('progress', { totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
// const spin2 = AwesomeLogger.create('spinner', {
//   text: ' My text',
//   spinnerDelay: 75,
//   spinnerFrames: ['▄', '■', '▀', '▀', '■']
// });

// const multi1 = AwesomeLogger.create('multi', { children: [spin1, line1, line2, prog1] });
// const multi2 = AwesomeLogger.create('multi', { children: [line2, prog2, spin2] });
// const multi = AwesomeLogger.log('multi', { children: [multi1, multi2] });

// const sendkeys = require('sendkeys');

// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.green(' yaaas\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yeees\nnext line\n\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yeees\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yeees\nnext line\neven \none \nmore') });
// AwesomeLogger.log('text', { text: chalk.red('awdawd\nsecondline') + chalk.yellow(' awdawdawd') });

const ctrl = AwesomeLogger.log('text', { text: chalk.red('yee') });

// const spin1 = AwesomeLogger.create('spinner', {
//   text: ' My text',
//   spinnerDelay: 75,
//   spinnerFrames: ['▄', '■', '▀', '▀', '■']
// });
// const prog1 = AwesomeLogger.create('progress', { totalProgress: 100, maxWidth: 100 });

// AwesomeLogger.log('multi', { children: [spin1, prog1] });

// setInterval(() => {
//   prog1.setProgress(Math.random() * 100);
// }, 100);

const checklistLogger = AwesomeLogger.create('checklist', {
  items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(x => {
    return { text: `item${x}`, state: 'pending' } as AwesomeChecklistLoggerItem;
  })
});

AwesomeLogger.log('multi', { children: [checklistLogger, ctrl] });

setInterval(() => {
  checklistLogger.changeState(Math.round(Math.random() * 9), 'succeeded');
  ctrl.setText(`nope${Math.random()}`);
}, 100);

// const a = AwesomeLogger.prompt('text', { text: 'yee' });
// a.result.then(x => console.log('result = ' + x));
