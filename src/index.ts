import { MultilineLogger } from './multiline-logger';
import { SimpleLineLogger } from './simple-line-logger';

const a1 = new SimpleLineLogger('');
const a2 = new SimpleLineLogger('');
const a3 = new SimpleLineLogger('');
const b = new MultilineLogger([a1, a2, a3]);

while (true) {
  b.render();

  a1.setNextText('val: ' + Math.random())
  a3.setNextText({ text: 'val: ' + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random(), color: "CYAN" })
}
