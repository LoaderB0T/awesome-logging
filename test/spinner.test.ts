import { Terminal } from 'node-terminal-emulator';
import { AwesomeLogger } from '../src/index';
import { Stdout } from '../src/render/stdout';
import { TestInit } from './reset';

describe('', () => {
  let t: Terminal;

  beforeEach(() => {
    t = TestInit.getTerminal();
  });

  afterEach(() => {
    t.restoreStdout(Stdout.getInstance());
  });

  test('spinner successful with text', () => {
    const c = AwesomeLogger.log('spinner', { text: 'spinner' });
    expect(t.text).toStrictEqual(['', '.   spinner']);
    c.stop({ succeeded: true, text: 'done' });
    expect(t.text).toStrictEqual(['', '√ done']);
  });

  test('spinner unsuccessful with text', () => {
    const c = AwesomeLogger.log('spinner', { text: 'spinner' });
    expect(t.text).toStrictEqual(['', '.   spinner']);
    c.stop({ succeeded: false, text: 'done' });
    expect(t.text).toStrictEqual(['', 'X done']);
  });

  test('spinner with text', () => {
    const c = AwesomeLogger.log('spinner', { text: 'spinner' });
    expect(t.text).toStrictEqual(['', '.   spinner']);
    c.stop({ text: 'done' });
    expect(t.text).toStrictEqual(['', 'done']);
  });

  test('spinner stop', () => {
    const c = AwesomeLogger.log('spinner', { text: 'spinner' });
    expect(t.text).toStrictEqual(['', '.   spinner']);
    c.stop({});
    expect(t.text).toStrictEqual(['', 'spinner']);
  });

  // todo
  test.skip('spinner removeline', () => {
    const c = AwesomeLogger.log('spinner', { text: 'spinner' });
    expect(t.text).toStrictEqual(['', '.   spinner']);
    c.stop({ removeLine: true });
    expect(t.text).toStrictEqual(['']);
  });
});
