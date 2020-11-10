import { MultilineLogger } from './multiline-logger';
import { ProgressLogger } from './progress-logger';
import { SimpleLineLogger } from './simple-line-logger';

const a1 = new SimpleLineLogger('');
const a2 = new SimpleLineLogger('');
const a3 = new SimpleLineLogger('');
const p1 = new ProgressLogger({ totalProgress: 100, filledColor: 'GREEN' });
const b = new MultilineLogger([a1, a2, a3, p1]);

a1.setNextText('val1: ' + Math.random())
a3.setNextText({ text: 'val3: ' + Math.random(), color: "CYAN" });

a2.setNextText({ text: 'val2: ' + Math.random(), color: "MAGENTA" })


setInterval(() => {

  p1.setProgress(Math.round(Math.random() * 100));
  b.render();
}, 1000);
