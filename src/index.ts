import { SimpleMultilineLogger } from './complex-logger/simple-multiline-logger';
import { SimpleProgressLogger } from './line-logger/progress-logger';
import { SimpleLineLogger } from './line-logger/simple-line-logger';
import { SimpleSpinnerLogger } from './line-logger/spinner-logger';

const a1 = new SimpleLineLogger('');
const a2 = new SimpleLineLogger('');
const a3 = new SimpleLineLogger('');
const p1 = new SimpleProgressLogger({ totalProgress: 100, filledColor: 'GREEN', maxWidth: 100 });
const s1 = new SimpleSpinnerLogger({ text: 'My text', spinnerDelay: 100 });
const b = new SimpleMultilineLogger([a1, a2, a3, p1, s1]);



setInterval(() => {
  a1.setNextText('val1: ' + Math.random())
  a3.setNextText({ text: 'val3: ' + Math.random(), color: "CYAN" });
  a2.setNextText({ text: 'val2: ' + Math.random(), color: "MAGENTA" })
  p1.setProgress(Math.round(Math.random() * 100));
}, 2000);
