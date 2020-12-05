import { AwesomeLogger } from './awesome-logger';


// AwesomeLogger.log('text', { text: { text: 'awd', color: 'CYAN' } });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// const line1 = AwesomeLogger.create('text', { text: { text: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15', color: 'GREEN' } });
// const line2 = AwesomeLogger.create('text', { text: { text: 'awd\nawd2awd3', color: 'GREEN' } });
// const prog1 = AwesomeLogger.create('progress', { totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
// const spin1 = AwesomeLogger.create('spinner', { text: ' My text', spinnerDelay: 75, spinnerFrames: ['▄', '■', '▀', '▀', '■'], spinnerColor: 'MAGENTA' });
// const line2 = AwesomeLogger.create('text', { text: [{ text: 'awd\nawd2awd3', color: 'GREEN' }] });
// const prog2 = AwesomeLogger.create('progress', { totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
// const spin2 = AwesomeLogger.create('spinner', { text: ' My text', spinnerDelay: 75, spinnerFrames: ['▄', '■', '▀', '▀', '■'], spinnerColor: 'MAGENTA' });

// const multi1 = AwesomeLogger.log('multi', { children: [line1, line2, prog1, spin1] });
// const multi2 = AwesomeLogger.create('multi', { children: [line2, prog2, spin2] });
// const multi = AwesomeLogger.log('multi', { children: [multi1, multi2] });

// line2.setText('\n\n\n\n\ntest');

// setInterval(() => {
//   prog1.setProgress(Math.round(Math.random() * 100));
//   // prog2.setProgress(Math.round(Math.random() * 100));
// }, 1000);
// let i = 1;
// setInterval(() => {
//   line1.setText(`awdNew${`\nline${i}`.repeat(i)}`);
//   i++;
//   if (i > 5) {
//     i = 0;
//   }
// }, 2000);
// let i2 = 1;
// setInterval(() => {
//   line2.setText(`awdNew${`\nline${i2}`.repeat(i2)}`);
//   i2++;
//   if (i2 > 5) {
//     i2 = 0;
//   }
// }, 3000);
// let i3 = 0;
// setInterval(() => {
//   AwesomeLogger.interrupt('text', { text: { text: `bla${i3}`, color: 'RED' } });
//   i3++;
// }, 5000);

AwesomeLogger.prompt('text', { text: 'yeeeeeeeeeee', autoComplete: ['yeeeeee', 'awdware', 'nice story'] });
