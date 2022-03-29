import { Terminal } from 'node-terminal-simulator';
import { AwesomeLogger } from '../src/index';
import { Stdout } from '../src/render/stdout';
import { TestInit } from './reset';

describe('Confirm Prompt', () => {
  let t: Terminal;

  beforeEach(() => {
    t = TestInit.getTerminal();
  });

  afterEach(() => {
    t.restoreStdout(Stdout.getInstance());
  });

  test('confirm', done => {
    const c = AwesomeLogger.prompt('confirm', { text: 'continue?' });
    expect(t.allLines).toStrictEqual(['', 'continue? [y/n]']);
    c.result.then(r => {
      expect(r).toBe(true);
      expect(t.allLines).toStrictEqual(['', 'continue? [Y/n]']);
      done();
    });
    t.sendKey('enter'); // Enter does nothing if no default is set
    expect(t.allLines).toStrictEqual(['', 'continue? [y/n]']);
    t.sendText('y');
  });

  test('reject', done => {
    const c = AwesomeLogger.prompt('confirm', { text: 'continue?' });
    expect(t.allLines).toStrictEqual(['', 'continue? [y/n]']);
    c.result.then(r => {
      expect(r).toBe(false);
      expect(t.allLines).toStrictEqual(['', 'continue? [y/N]']);
      done();
    });
    t.sendText('n');
  });

  test('default confirm', done => {
    const c = AwesomeLogger.prompt('confirm', { text: 'continue?', default: 'yes' });
    expect(t.allLines).toStrictEqual(['', 'continue? [y/n]']);
    c.result.then(r => {
      expect(r).toBe(true);
      expect(t.allLines).toStrictEqual(['', 'continue? [Y/n]']);
      done();
    });
    t.sendKey('enter');
  });

  test('default reject', done => {
    const c = AwesomeLogger.prompt('confirm', { text: 'continue?', default: 'no' });
    expect(t.allLines).toStrictEqual(['', 'continue? [y/n]']);
    c.result.then(r => {
      expect(r).toBe(false);
      expect(t.allLines).toStrictEqual(['', 'continue? [y/N]']);
      done();
    });
    t.sendKey('enter');
  });
});
