import { Terminal } from 'node-terminal-emulator';
import { AwesomeLogger } from '../src/index';
import { Stdout } from '../src/render/stdout';
import { TestInit } from './reset';

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
    expect(t.text).toStrictEqual(['', 'enter text', 'type your answer here...']);
    c.result.then(r => {
      expect(r).toBe('my answer!');
      expect(t.text).toStrictEqual(['', ' - Input: my answer!']);
      done();
    });
    t.sendText('my answer!');
    t.sendKey('enter');
  });

  test('Text prompt with optional autocomplete', done => {
    const c = AwesomeLogger.prompt('text', { text: 'enter text', hints: ['abcdefg', 'abc123', 'abc111'] });
    expect(t.text).toStrictEqual(['', 'enter text', 'abcdefg']);
    c.result.then(r => {
      expect(r).toBe('abc11');
      expect(t.text).toStrictEqual(['', ' - Input: abc11']);
      done();
    });
    t.sendText('abc');
    expect(t.text).toStrictEqual(['', 'enter text', 'abcdefg']);
    t.sendText('1');
    expect(t.text).toStrictEqual(['', 'enter text', 'abc123']);
    t.sendText('1');
    expect(t.text).toStrictEqual(['', 'enter text', 'abc111']);
    t.sendKey('enter');
  });

  test.only('Text prompt with required autocomplete', done => {
    const c = AwesomeLogger.prompt('text', { text: 'enter text', hints: ['abcdefg', 'abc123', 'abc111'], allowOnlyHints: true });
    expect(t.text).toStrictEqual(['', 'enter text', 'abcdefg']);
    c.result.then(r => {
      expect(r).toBe('abcdefg');
      expect(t.text).toStrictEqual(['', ' - Input: abcdefg']);
      done();
    });
    t.sendText('a');
    expect(t.text).toStrictEqual(['', 'enter text', 'abcdefg']);
    t.sendKey('enter'); // does nothing, because text doesn't match any hints yet
    expect(t.text).toStrictEqual(['', 'enter text', 'abcdefg (invalid)']);
    t.sendKey('tab');
    t.sendText('+');
    expect(t.text).toStrictEqual(['', 'enter text', 'abcdefg+']);
    t.sendKey('enter'); // does nothing, because text doesn't match any hints yet
    expect(t.text).toStrictEqual(['', 'enter text', 'abcdefg+  (invalid)']); // two spaces because of cursor placeholder
    t.sendKey('backspace');
    expect(t.text).toStrictEqual(['', 'enter text', 'abcdefg']);
    t.sendKey('enter');
  });
});
