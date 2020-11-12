import { yellow } from 'chalk';
import { SimpleMultilineLogger } from './complex-logger/simple-multiline-logger';
import { SimpleProgressLogger } from './line-logger/progress-logger';
import { SimpleLineLogger } from './line-logger/simple-line-logger';
import { SimpleSpinnerLogger } from './line-logger/spinner-logger';

const a1 = new SimpleLineLogger('');
const a2 = new SimpleLineLogger('');
const a3 = new SimpleLineLogger('');
const p1 = new SimpleProgressLogger({ totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
const s1 = new SimpleSpinnerLogger({ text: 'My text', spinnerDelay: 100 });
const s2 = new SimpleSpinnerLogger({ text: 'My text', spinnerDelay: 100 });
const s3 = new SimpleSpinnerLogger({ text: 'My text', spinnerDelay: 100 });
const b = new SimpleMultilineLogger([a1, a2, a3, p1, s1, s2, s3]);


setInterval(() => {
  a1.setNextText('val1: ' + Math.random())
  a2.setNextText({ text: 'val2: ' + Math.random(), color: "MAGENTA" })
  a3.setNextText({ text: 'val3: ' + Math.random() + '\nyeee\nbla', color: "CYAN" });
  p1.setProgress(Math.round(Math.random() * 100));
}, 300);

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
