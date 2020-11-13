import { AwesomeLogger } from './awesome-logger';


// AwesomeLogger.log('text', { text: { text: 'awd', color: 'CYAN' } });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
// AwesomeLogger.logText({ text: 'awd', color: 'GREEN' });
const line1 = AwesomeLogger.create('text', { text: [{ text: 'awd\nawd2awd3', color: 'GREEN' }] });
const prog1 = AwesomeLogger.create('progress', { totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
const spin1 = AwesomeLogger.create('spinner', { text: ' My text', spinnerDelay: 75, spinnerFrames: ['▄', '■', '▀', '▀', '■'], spinnerColor: 'MAGENTA' });
const line2 = AwesomeLogger.create('text', { text: [{ text: 'awd\nawd2awd3', color: 'GREEN' }] });
const prog2 = AwesomeLogger.create('progress', { totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
const spin2 = AwesomeLogger.create('spinner', { text: ' My text', spinnerDelay: 75, spinnerFrames: ['▄', '■', '▀', '▀', '■'], spinnerColor: 'MAGENTA' });

const multi1 = AwesomeLogger.create('multi', { children: [line1, prog1, spin1] });
const multi2 = AwesomeLogger.create('multi', { children: [line2, prog2, spin2] });
const multi = AwesomeLogger.log('multi', { children: [multi1, multi2] });

setInterval(() => {
  prog1.setProgress(Math.round(Math.random() * 100));
  prog2.setProgress(Math.round(Math.random() * 100));
}, 1000);
let i = 1;
setInterval(() => {
  line1.setText(`awdNew${`\nline${i}`.repeat(i)}`);
  i++;
  if (i > 5) {
    i = 0;
  }
}, 2000);
let i2 = 1;
setInterval(() => {
  line2.setText(`awdNew${`\nline${i2}`.repeat(i2)}`);
  i2++;
  if (i2 > 5) {
    i2 = 0;
  }
}, 3000);
let i3 = 0;
setInterval(() => {
  AwesomeLogger.interrupt('text', { text: { text: `bla${i3}`, color: 'RED' } });
  i3++;
}, 5000);

// import { SimpleMultilineLogger } from './complex-logger/simple-multiline-logger';
// import { SimpleProgressLogger } from './line-logger/progress-logger';
// import { SimpleLineLogger } from './line-logger/simple-line-logger';
// import { SimpleSpinnerLogger } from './line-logger/spinner-logger';

// const a1 = new SimpleLineLogger('');
// const a2 = new SimpleLineLogger('');
// const a3 = new SimpleLineLogger('');
// const p1 = new SimpleProgressLogger({ totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
// const s1 = new SimpleSpinnerLogger({ text: 'My text', spinnerDelay: 100 });
// const s2 = new SimpleSpinnerLogger({ text: 'My text', spinnerDelay: 100 });
// const s3 = new SimpleSpinnerLogger({ text: 'My text', spinnerDelay: 100 });
// const b = new SimpleMultilineLogger([a1, a2, a3, p1, s1, s2, s3]);


// setInterval(() => {
//   a1.setNextText('val1: ' + Math.random())
//   a2.setNextText({ text: 'val2: ' + Math.random(), color: "MAGENTA" })
//   a3.setNextText({ text: 'val3: ' + Math.random() + '\nyeee\nbla', color: "CYAN" });
//   p1.setProgress(Math.round(Math.random() * 100));
// }, 300);

// setInterval(() => {
//   const i = new SimpleLineLogger({ text: 'yeee1\nyeee2\nyeee3', color: 'YELLOW' })
//   b.interrupt(i);
// }, 1000);

// setTimeout(() => {
//   s1.complete({ deleteLine: true });
// }, 2000);
// setTimeout(() => {
//   s2.complete({ deleteLine: true });
// }, 3000);
// setTimeout(() => {
//   s3.complete({ deleteLine: true });
// }, 4000);
