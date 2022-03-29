import { Terminal } from 'node-terminal-simulator';
import { AwesomeLogger } from '../src/index';
import { Stdout } from '../src/render/stdout';
import { TestInit } from './reset';

describe('Toggle Prompt', () => {
  let t: Terminal;

  beforeEach(() => {
    t = TestInit.getTerminal();
  });

  afterEach(() => {
    t.restoreStdout(Stdout.getInstance());
    Terminal.logToFile('');
  });

  test('three options', done => {
    const c = AwesomeLogger.prompt('choice', { options: ['option 1', 'option 2', 'option 3'] });
    c.result.then(r => {
      expect(r).toStrictEqual('option 2');
      expect(t.allLines).toStrictEqual(['', ' - Selected option: option 2']);
      done();
    });
    expect(t.allLines).toStrictEqual(['', ' - option 1', ' - option 2', ' - option 3']);
    expect(c.getCurrentAnswer()).toStrictEqual('option 1');
    t.sendKey('down');
    expect(t.allLines).toStrictEqual(['', ' - option 1', ' - option 2', ' - option 3']);
    expect(c.getCurrentAnswer()).toStrictEqual('option 2');
    t.sendKey('enter');
  });

  test('10 options', done => {
    const c = AwesomeLogger.prompt('choice', {
      options: [
        'option 1',
        'option 2',
        'option 3',
        'option 4',
        'option 5',
        'option 6',
        'option 7',
        'option 8',
        'option 9',
        'option 10'
      ]
    });
    c.result.then(r => {
      expect(r).toStrictEqual('option 7');
      expect(t.allLines).toStrictEqual(['', ' - Selected option: option 7']);
      done();
    });
    expect(t.allLines).toStrictEqual([
      '',
      '|  - option 1', // current highlighted
      '|  - option 2',
      '|  - option 3',
      '|  - option 4',
      '|  - option 5',
      '↓  - option 6'
    ]);
    expect(c.getCurrentAnswer()).toStrictEqual('option 1');

    t.sendKey('down');
    t.sendKey('down');
    expect(t.allLines).toStrictEqual([
      // nothing really changed
      '',
      '|  - option 1',
      '|  - option 2',
      '|  - option 3', // current highlighted
      '|  - option 4',
      '|  - option 5',
      '↓  - option 6'
    ]);
    expect(c.getCurrentAnswer()).toStrictEqual('option 3');

    t.sendKey('down');
    t.sendKey('down');
    t.sendKey('down');
    t.sendKey('down');
    expect(t.allLines).toStrictEqual([
      '',
      '↑  - option 3',
      '|  - option 4',
      '|  - option 5',
      '|  - option 6',
      '|  - option 7', // current highlighted
      '↓  - option 8'
    ]);
    expect(c.getCurrentAnswer()).toStrictEqual('option 7');
    t.sendKey('enter');
  });

  test('10 options with text', done => {
    const c = AwesomeLogger.prompt('choice', {
      text: 'Please choose one of the following options:',
      options: [
        'option 1',
        'option 2',
        'option 3',
        'option 4',
        'option 5',
        'option 6',
        'option 7',
        'option 8',
        'option 9',
        'option 10'
      ]
    });
    c.result.then(r => {
      expect(r).toStrictEqual('option 1');
      expect(t.allLines).toStrictEqual(['', ' - Selected option: option 1']);
      done();
    });
    expect(t.allLines).toStrictEqual([
      '',
      'Please choose one of the following options:',
      '|  - option 1', // current highlighted
      '|  - option 2',
      '|  - option 3',
      '|  - option 4',
      '↓  - option 5'
    ]);
    expect(c.getCurrentAnswer()).toStrictEqual('option 1');

    t.sendKey('down');
    t.sendKey('down');
    expect(t.allLines).toStrictEqual([
      // nothing really changed
      '',
      'Please choose one of the following options:',
      '|  - option 1',
      '|  - option 2',
      '|  - option 3', // current highlighted
      '|  - option 4',
      '↓  - option 5'
    ]);
    expect(c.getCurrentAnswer()).toStrictEqual('option 3');

    t.sendKey('down');
    expect(t.allLines).toStrictEqual([
      // nothing really changed
      '',
      'Please choose one of the following options:',
      '|  - option 1',
      '|  - option 2',
      '|  - option 3',
      '|  - option 4', // current highlighted
      '↓  - option 5'
    ]);

    t.sendKey('down');
    expect(t.allLines).toStrictEqual([
      '',
      'Please choose one of the following options:',
      '↑  - option 2',
      '|  - option 3',
      '|  - option 4',
      '|  - option 5', // current highlighted
      '↓  - option 6'
    ]);

    t.sendKey('down');
    expect(t.allLines).toStrictEqual([
      '',
      'Please choose one of the following options:',
      '↑  - option 3',
      '|  - option 4',
      '|  - option 5',
      '|  - option 6', // current highlighted
      '↓  - option 7'
    ]);

    t.sendKey('down');
    expect(t.allLines).toStrictEqual([
      '',
      'Please choose one of the following options:',
      '↑  - option 4',
      '|  - option 5',
      '|  - option 6',
      '|  - option 7', // current highlighted
      '↓  - option 8'
    ]);

    t.sendKey('down');
    expect(t.allLines).toStrictEqual([
      '',
      'Please choose one of the following options:',
      '↑  - option 5',
      '|  - option 6',
      '|  - option 7',
      '|  - option 8', // current highlighted
      '↓  - option 9'
    ]);

    t.sendKey('down');
    expect(t.allLines).toStrictEqual([
      '',
      'Please choose one of the following options:',
      '↑  - option 6',
      '|  - option 7',
      '|  - option 8',
      '|  - option 9', // current highlighted
      '|  - option 10'
    ]);

    expect(c.getCurrentAnswer()).toStrictEqual('option 9');
    t.sendKey('down');
    expect(t.allLines).toStrictEqual([
      '',
      'Please choose one of the following options:',
      '↑  - option 6',
      '|  - option 7',
      '|  - option 8',
      '|  - option 9',
      '|  - option 10' // current highlighted
    ]);
    expect(c.getCurrentAnswer()).toStrictEqual('option 10');

    t.sendKey('down'); // Nothing happens
    t.sendKey('down'); // Nothing happens
    t.sendKey('down'); // Nothing happens

    t.sendKey('up');
    t.sendKey('up');
    t.sendKey('up');
    t.sendKey('up');
    t.sendKey('up');
    expect(t.allLines).toStrictEqual([
      '',
      'Please choose one of the following options:',
      '↑  - option 4',
      '|  - option 5', // current highlighted
      '|  - option 6',
      '|  - option 7',
      '↓  - option 8'
    ]);

    t.sendKey('up');
    t.sendKey('up');
    t.sendKey('up');
    expect(t.allLines).toStrictEqual([
      '',
      'Please choose one of the following options:',
      '|  - option 1',
      '|  - option 2', // current highlighted
      '|  - option 3',
      '|  - option 4',
      '↓  - option 5'
    ]);

    t.sendKey('up');
    expect(t.allLines).toStrictEqual([
      '',
      'Please choose one of the following options:',
      '|  - option 1', // current highlighted
      '|  - option 2',
      '|  - option 3',
      '|  - option 4',
      '↓  - option 5'
    ]);

    t.sendKey('up'); // Nothing happens
    t.sendKey('up'); // Nothing happens
    t.sendKey('up'); // Nothing happens
    t.sendKey('enter');
  });
});
