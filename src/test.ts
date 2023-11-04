import chalk from 'chalk';
import { AwesomeLogger } from './awesome-logger.js';

AwesomeLogger.log('awd');
AwesomeLogger.log('awd2');
AwesomeLogger.log('awd3');
AwesomeLogger.interrupt('awdA');
AwesomeLogger.interrupt('awdB');
AwesomeLogger.interrupt('awdC');
AwesomeLogger.log('awd4');
AwesomeLogger.log('awd5');

// setTimeout(() => {
//   const textA = 'One line of text...';
//   const textB = 'Multiple\nLines\nof Text!';
//   let state = true;
//   const logControl = AwesomeLogger.log(textA);
//   setInterval(() => {
//     state = !state;
//     logControl.setText(state ? textA : textB);
//   }, 1000);
// }, 3000);

// const logProgressControl = AwesomeLogger.log('progress', {
//   totalProgress: 100,
//   text: 'Very important progress:'
// });
// let i = 0;
// const interval = setInterval(() => {
//   logProgressControl.setProgress(i++);
//   if (i === 100) {
//     clearInterval(interval);
//   }
// }, 500);

// setInterval(() => {
//   AwesomeLogger.interrupt('interrupt' + Math.random());
// }, 4000);

// const promptForLog = () => {
//   const a = AwesomeLogger.prompt('choice', {
//     options: ['text', 'spinner', 'progressbar', 'placeholder1', 'placeholder2', 'placeholder3', 'placeholder4', 'placeholder5']
//   });

//   a.result.then(x => {
//     const logger = createExampleLogger(x)!;
//     AwesomeLogger.log(logger);
//     setTimeout(() => {
//       promptForLog();
//     }, 2000);
//   });
// };

// promptForLog();

// const createExampleLogger = (type: string) => {
//   switch (type) {
//     case 'text': {
//       return AwesomeLogger.create('text', { text: chalk.red('Example text') });
//     }
//     case 'spinner': {
//       return AwesomeLogger.create('spinner', {
//         text: ' My text',
//         spinnerDelay: 75,
//         spinnerFrames: [
//           chalk.magenta('■'),
//           chalk.magenta('▄'),
//           chalk.magenta('■'),
//           chalk.magenta('▀'),
//           chalk.magenta('▀'),
//           chalk.yellow('■'),
//           chalk.yellow('▄'),
//           chalk.yellow('■'),
//           chalk.yellow('▀'),
//           chalk.yellow('▀')
//         ]
//       });
//     }
//     case 'progressbar': {
//       return AwesomeLogger.create('progress', { totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
//     }
//   }
// };

// const c = AwesomeLogger.prompt('toggle', {
//   options: [
//     'option 1',
//     'option 2',
//     'option 3',
//     'option 4',
//     'option 5',
//     'option 6',
//     'option 7',
//     'option 8',
//     'option 9',
//     'option 10'
//   ]
// });
// c.result.then(r => {});

// AwesomeLogger.prompt('confirm', { text: 'Are you really sure?' }).result.then(r => {
//   console.log(r);
// });

// AwesomeLogger.prompt('toggle', {
//   text: 'What do you chose?',
//   options: ['Option1', 'Option2', 'Option3', 'Option4', 'Option5', 'Option6', 'Option7', 'Option8', 'Option9', 'Option10']
// }).result.then(r => {
//   console.log(r);
// });

// AwesomeLogger.prompt('text', {
//   text: 'Please enter your phone number',
//   validator: (value: string) => {
//     if (value.length < 10) {
//       return false;
//     }
//     return true;
//   }
// }).result.then(r => {
//   console.log(r);
// });

// const logger1 = AwesomeLogger.create('spinner', {
//   text: 'Loading!',
//   spinnerFrames: [
//     chalk.yellow('⠋'), // '◐',
//     chalk.yellow('⠙'), // '◓',
//     chalk.yellow('⠹'), // '◑',
//     chalk.yellow('⠸'), // '◒',
//     chalk.yellow('⠼'), // '◐',
//     chalk.yellow('⠴'), // '◓',
//     chalk.yellow('⠦'), // '◑',
//     chalk.yellow('⠧'), // '◒',
//     chalk.yellow('⠇'), // '◐',
//     chalk.yellow('⠏') // '◓'
//   ],
//   spinnerDelay: 75
// });
// const logger2 = AwesomeLogger.create('progress', {
//   text: 'Progress!',
//   maxWidth: 75,
//   borderChar: '─',
//   filledChar: '█',
//   filledColor: 'GREEN',
//   unfilledChar: '░',
//   unfilledColor: 'RED'
// });

// setInterval(() => {
//   logger2.setProgress(Math.floor(Math.random() * 100));
// }, 100);

// setInterval(() => {
//   AwesomeLogger.interrupt('interrupt' + Math.random());
// }, 1000);

// AwesomeLogger.log('multi', {
//   children: [logger1, logger2]
// });

// const line0 = AwesomeLogger.create('text', { text: chalk.yellow('Multiple lines, all changing:') });
// const line1 = AwesomeLogger.create('text', { text: chalk.blue('Important Information') });
// const prog1 = AwesomeLogger.create('progress', { totalProgress: 100, filledColor: 'GREEN', maxWidth: 50 });
// const spin1 = AwesomeLogger.create('spinner', {
//   text: 'Loading Animation',
//   spinnerDelay: 75,
//   spinnerFrames: [chalk.magenta('▄'), chalk.magenta('■'), chalk.magenta('▀'), chalk.magenta('▀'), chalk.magenta('■')]
// });
// let textState = true;
// setInterval(() => {
//   textState = !textState;
//   line1.setText(textState ? chalk.blue('Important Information') : chalk.green('Green text, because why not?'));
// }, 1000);
// let i = 0;
// setInterval(() => {
//   i += 1;
//   prog1.setProgress(i);
// }, 300);
// const line2 = AwesomeLogger.create('text', { text: chalk.green('awd\nawd2awd3') });
// const prog2 = AwesomeLogger.create('progress', { totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
// const spin2 = AwesomeLogger.create('spinner', {
//   text: ' My text',
//   spinnerDelay: 75,
//   spinnerFrames: ['▄', '■', '▀', '▀', '■']
// });

// const multi1 = AwesomeLogger.log('multi', { children: [line0, spin1, line1, prog1] });
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

// const ctrl = AwesomeLogger.log('text', { text: chalk.red('yee') });

// setInterval(() => {
//   ctrl.setText(
//     `1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9`
//   );
//   setTimeout(() => {
//     ctrl.setText(
//       `A
// B
// C
// D
// E
// F
// G
// H
// I`
//     );
//   }, 500);
// }, 1000);

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

// const checklistLogger = AwesomeLogger.create('checklist', {
//   items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(x => {
//     return { text: `item${x}`, state: 'pending' } as AwesomeChecklistLoggerItem;
//   })
// });

// AwesomeLogger.log('multi', { children: [checklistLogger, ctrl] });

// setInterval(() => {
//   checklistLogger.changeState(Math.round(Math.random() * 9), 'succeeded');
//   ctrl.setText(`nope${Math.random()}`);
// }, 100);

// const a = AwesomeLogger.prompt('text', {
//   text: 'Please enter your phone number:',
//   validators: [
//     {
//       description: 'The minimal input length is 3',
//       validator: (input: string) => {
//         return input.length >= 3;
//       }
//     },
//     {
//       description: 'Your input has to start with "+"',
//       validator: (input: string) => {
//         return input.startsWith('+');
//       }
//     }
//   ]
// });
// a.result.then(x => console.log('result = ' + x));

const awd = AwesomeLogger.log('checklist', {
  items: [
    { text: 'item1', state: 'pending' },
    { text: 'item2', state: 'pending' },
    { text: 'item3', state: 'pending' },
    { text: 'item4', state: 'pending' },
    { text: 'item5', state: 'pending' },
    { text: 'item6', state: 'pending' },
    { text: 'item7', state: 'pending' },
    { text: 'item8', state: 'pending' },
    { text: 'item9', state: 'pending' },
    { text: 'item10', state: 'pending' },
  ],
  logAllFinalStates: false,
});

awd.changeState(0, 'succeeded');
awd.changeState(3, 'succeeded');

awd.end();
