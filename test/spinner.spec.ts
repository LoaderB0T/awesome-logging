import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { Terminal } from 'node-terminal-simulator';
import { AwesomeLogger } from '../src/index.js';
import { Stdout } from '../src/render/stdout.js';
import { TestInit } from './reset.js';

describe('Spinner Logger', () => {
  let t: Terminal;

  beforeEach(() => {
    t = TestInit.getTerminal();
  });

  afterEach(() => {
    t.restoreStdout(Stdout.getInstance());
  });

  test('spinner successful with text', () => {
    const c = AwesomeLogger.log('spinner', { text: 'spinner' });
    expect(t.allLines).toStrictEqual(['', '.   spinner']);
    c.stop({ succeeded: true, text: 'done' });
    expect(t.allLines).toStrictEqual(['', '√ done']);
  });

  test('spinner unsuccessful with text', () => {
    const c = AwesomeLogger.log('spinner', { text: 'spinner' });
    expect(t.allLines).toStrictEqual(['', '.   spinner']);
    c.stop({ succeeded: false, text: 'done' });
    expect(t.allLines).toStrictEqual(['', 'X done']);
  });

  test('spinner with text', () => {
    const c = AwesomeLogger.log('spinner', { text: 'spinner' });
    expect(t.allLines).toStrictEqual(['', '.   spinner']);
    c.stop({ text: 'done' });
    expect(t.allLines).toStrictEqual(['', 'done']);
  });

  test('spinner stop', () => {
    const c = AwesomeLogger.log('spinner', { text: 'spinner' });
    expect(t.allLines).toStrictEqual(['', '.   spinner']);
    c.stop({});
    expect(t.allLines).toStrictEqual(['', 'spinner']);
  });

  test('spinner removeline', () => {
    const c = AwesomeLogger.log('spinner', { text: 'spinner' });
    expect(t.allLines).toStrictEqual(['', '.   spinner']);
    c.stop({ removeLine: true });
    // @todo Make this only one line
    expect(t.allLines).toStrictEqual(['', '']);
  });
});
