import { describe, expect, test, beforeEach, afterEach } from 'vitest';

import { Terminal } from 'node-terminal-simulator';
import { AwesomeLogger } from '../src/index.js';
import { Stdout } from '../src/render/stdout.js';
import { TestInit } from './reset.js';

describe('Confirm Prompt', () => {
  let t: Terminal;

  beforeEach(() => {
    t = TestInit.getTerminal();
  });

  afterEach(() => {
    t.restoreStdout(Stdout.getInstance());
  });

  test('confirm', async () => {
    const c = AwesomeLogger.prompt('confirm', { text: 'continue?' });
    expect(t.allLines).toStrictEqual(['', 'continue? [y/n]']);
    const resultPromise = c.result.then(r => {
      expect(r).toBe(true);
      expect(t.allLines).toStrictEqual(['', 'continue? [Y/n]']);
    });
    t.sendKey('enter'); // Enter does nothing if no default is set
    expect(t.allLines).toStrictEqual(['', 'continue? [y/n]']);
    t.sendText('y');
    await resultPromise;
  });

  test('reject', async () => {
    const c = AwesomeLogger.prompt('confirm', { text: 'continue?' });
    expect(t.allLines).toStrictEqual(['', 'continue? [y/n]']);
    const resultPromise = c.result.then(r => {
      expect(r).toBe(false);
      expect(t.allLines).toStrictEqual(['', 'continue? [y/N]']);
    });
    t.sendText('n');
    await resultPromise;
  });

  test('default confirm', async () => {
    const c = AwesomeLogger.prompt('confirm', { text: 'continue?', default: 'yes' });
    expect(t.allLines).toStrictEqual(['', 'continue? [y/n]']);
    const resultPromise = c.result.then(r => {
      expect(r).toBe(true);
      expect(t.allLines).toStrictEqual(['', 'continue? [Y/n]']);
    });
    t.sendKey('enter');
    await resultPromise;
  });

  test('default reject', async () => {
    const c = AwesomeLogger.prompt('confirm', { text: 'continue?', default: 'no' });
    expect(t.allLines).toStrictEqual(['', 'continue? [y/n]']);
    const resultPromise = c.result.then(r => {
      expect(r).toBe(false);
      expect(t.allLines).toStrictEqual(['', 'continue? [y/N]']);
    });
    t.sendKey('enter');
    await resultPromise;
  });
});
