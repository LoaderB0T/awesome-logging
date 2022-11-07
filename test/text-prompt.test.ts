import { Terminal } from 'node-terminal-simulator';
import { AwesomeLogger } from '../src/index.js';
import { Stdout } from '../src/render/stdout.js';
import { TestInit } from './reset.js';

describe('Text Prompt', () => {
  let t: Terminal;

  beforeEach(() => {
    t = TestInit.getTerminal();
  });

  afterEach(() => {
    t.restoreStdout(Stdout.getInstance());
  });

  test('ask for text', done => {
    const c = AwesomeLogger.prompt('text', { text: 'enter text' });
    expect(t.allLines).toStrictEqual(['', 'enter text', 'type your answer here...']);
    c.result.then(r => {
      expect(r).toBe('my answer!');
      expect(t.allLines).toStrictEqual(['', ' - Input: my answer!']);
      done();
    });
    t.sendText('my answer!');
    expect(c.getCurrentAnswer()).toBe('my answer!');
    t.sendKey('enter');
  });

  test('Text prompt with optional hints', done => {
    const c = AwesomeLogger.prompt('text', { text: 'enter text', hints: ['abcdefg', 'abc123', 'abc111'] });
    expect(t.allLines).toStrictEqual(['', 'enter text', 'abcdefg']);
    c.result.then(r => {
      expect(r).toBe('abc11');
      expect(t.allLines).toStrictEqual(['', ' - Input: abc11']);
      done();
    });
    t.sendText('abc');
    expect(c.getCurrentAnswer()).toBe('abc');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'abcdefg']);
    t.sendText('1');
    expect(c.getCurrentAnswer()).toBe('abc1');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'abc123']);
    t.sendText('1');
    expect(c.getCurrentAnswer()).toBe('abc11');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'abc111']);
    t.sendKey('enter');
  });

  test('Text prompt with required hints', done => {
    const c = AwesomeLogger.prompt('text', { text: 'enter text', hints: ['abcdefg', 'abc123', 'abc111'], allowOnlyHints: true });
    expect(t.allLines).toStrictEqual(['', 'enter text', 'abcdefg']);
    c.result.then(r => {
      expect(r).toBe('abcdefg');
      expect(t.allLines).toStrictEqual(['', ' - Input: abcdefg']);
      done();
    });
    t.sendText('a');
    expect(c.getCurrentAnswer()).toBe(undefined);
    expect(t.allLines).toStrictEqual(['', 'enter text', 'abcdefg']);
    t.sendKey('enter'); // does nothing, because text doesn't match any hints yet
    expect(t.allLines).toStrictEqual(['', 'enter text', 'abcdefg (invalid)']);
    t.sendKey('tab');
    expect(c.getCurrentAnswer()).toBe('abcdefg');
    t.sendText('+');
    expect(c.getCurrentAnswer()).toBe(undefined);
    expect(t.allLines).toStrictEqual(['', 'enter text', 'abcdefg+']);
    t.sendKey('enter'); // does nothing, because text doesn't match any hints yet
    expect(t.allLines).toStrictEqual(['', 'enter text', 'abcdefg+  (invalid)']); // two spaces because of cursor placeholder
    t.sendKey('backspace');
    expect(c.getCurrentAnswer()).toBe('abcdefg');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'abcdefg']);
    t.sendKey('enter');
  });

  test('Text prompt test arrow keys and tab', done => {
    const c = AwesomeLogger.prompt('text', { text: 'enter text', hints: ['example'] });
    expect(t.allLines).toStrictEqual(['', 'enter text', 'example']);
    c.result.then(r => {
      expect(r).toBe('example');
      expect(t.allLines).toStrictEqual(['', ' - Input: example']);
      done();
    });
    t.sendText('a');
    expect(c.getCurrentAnswer()).toBe('a');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'a']);
    t.sendKey('tab');
    expect(c.getCurrentAnswer()).toBe('a');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'a']);
    t.sendText('exam');
    t.sendKey('tab');
    expect(c.getCurrentAnswer()).toBe('aexam');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'aexam']);
    t.sendKey('left');
    t.sendKey('left');
    t.sendKey('left');
    t.sendKey('left');
    t.sendKey('backspace');
    expect(c.getCurrentAnswer()).toBe('exam');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'example']);
    t.sendKey('tab');
    expect(c.getCurrentAnswer()).toBe('example');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'example']);
    t.sendKey('tab');
    expect(c.getCurrentAnswer()).toBe('example');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'example']);
    t.sendKey('backspace');
    expect(c.getCurrentAnswer()).toBe('exampl');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'example']);
    t.sendKey('tab');
    expect(c.getCurrentAnswer()).toBe('example');
    expect(t.allLines).toStrictEqual(['', 'enter text', 'example']);
    t.sendKey('enter');
  });

  test('Text prompt with validators', done => {
    const c = AwesomeLogger.prompt('text', {
      text: 'Please enter your phone number:',
      validators: [
        {
          description: 'The minimal input length is 8',
          validator: (input: string) => {
            return input.length >= 8;
          }
        },
        {
          description: 'Your input has to start with "+"',
          validator: (input: string) => {
            return input.startsWith('+');
          }
        }
      ]
    });
    c.result.then(r => {
      expect(r).toBe('+49 123 45678900');
      expect(t.allLines).toStrictEqual(['', ' - Input: +49 123 45678900']);
      done();
    });
    expect(t.allLines).toStrictEqual(['', 'Please enter your phone number:', 'type your answer here...']);
    t.sendText('0 123');
    expect(t.allLines).toStrictEqual(['', 'Please enter your phone number:', '0 123']);
    t.sendKey('enter');
    expect(t.allLines).toStrictEqual([
      '',
      'Please enter your phone number:',
      '# The minimal input length is 8',
      '0 123  (invalid)'
    ]);
    t.sendText(' 45678900');
    expect(t.allLines).toStrictEqual([
      '',
      'Please enter your phone number:',
      '# The minimal input length is 8',
      '0 123 45678900'
    ]);
    t.sendKey('enter');
    expect(t.allLines).toStrictEqual([
      '',
      'Please enter your phone number:',
      '# Your input has to start with "+"',
      '0 123 45678900  (invalid)'
    ]);
    for (let i = 0; i < 13; i++) {
      t.sendKey('left');
    }
    t.sendKey('backspace');
    t.sendText('+49');
    expect(t.allLines).toStrictEqual([
      '',
      'Please enter your phone number:',
      '# Your input has to start with "+"',
      '+49 123 45678900'
    ]);
    t.sendKey('enter');
  });
});
