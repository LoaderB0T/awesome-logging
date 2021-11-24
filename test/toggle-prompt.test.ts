import { Terminal } from 'node-terminal-emulator';
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
    const c = AwesomeLogger.prompt('toggle', { options: ['option 1', 'option 2', 'option 3'] });
    c.result.then(r => {
      expect(r).toStrictEqual(['option 1', 'option 2']);
      expect(t.text).toStrictEqual(['', ' - Selected options: option 1, option 2']);
      done();
    });
    expect(t.text).toStrictEqual(['', '[ ] option 1', '[ ] option 2', '[ ] option 3']);
    expect(c.getCurrentAnswer()).toStrictEqual([]);
    t.sendKey('down');
    expect(t.text).toStrictEqual(['', '[ ] option 1', '[ ] option 2', '[ ] option 3']);
    expect(c.getCurrentAnswer()).toStrictEqual([]);
    t.sendText(' ');
    expect(t.text).toStrictEqual(['', '[ ] option 1', '[X] option 2', '[ ] option 3']);
    expect(c.getCurrentAnswer()).toStrictEqual(['option 2']);
    t.sendKey('down');
    t.sendText(' ');
    expect(t.text).toStrictEqual(['', '[ ] option 1', '[X] option 2', '[X] option 3']);
    expect(c.getCurrentAnswer()).toStrictEqual(['option 2', 'option 3']);
    t.sendText(' ');
    t.sendKey('up');
    t.sendKey('up');
    t.sendText(' ');
    t.sendKey('enter');
  });

  test('10 options', done => {
    Terminal.logToFile('./log.txt');
    const c = AwesomeLogger.prompt('toggle', {
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
      expect(r).toStrictEqual(['option 3', 'option 7']);
      expect(t.text).toStrictEqual(['', ' - Selected options: option 3, option 7']);
      done();
    });
    expect(t.text).toStrictEqual([
      '',
      '| [ ] option 1',
      '| [ ] option 2',
      '| [ ] option 3',
      '| [ ] option 4',
      '| [ ] option 5',
      '↓ [ ] option 6'
    ]);
    expect(c.getCurrentAnswer()).toStrictEqual([]);

    t.sendKey('down');
    t.sendKey('down');
    t.sendText(' ');
    expect(t.text).toStrictEqual([
      '',
      '| [ ] option 1',
      '| [ ] option 2',
      '| [X] option 3', // current selected
      '| [ ] option 4',
      '| [ ] option 5',
      '↓ [ ] option 6'
    ]);

    t.sendKey('down');
    t.sendKey('down');
    t.sendKey('down');
    t.sendKey('down');
    t.sendText(' ');
    expect(t.text).toStrictEqual([
      '',
      '↑ [X] option 3',
      '| [ ] option 4',
      '| [ ] option 5',
      '| [ ] option 6',
      '| [X] option 7', // current selected
      '↓ [ ] option 8'
    ]);

    t.sendKey('down');
    t.sendKey('down');
    t.sendKey('down');
    // fail('should not be able to select option 10');
    // t.sendText(' '); // Workaround for misterious failing test that only fails on AzureDevopsPipelines & GitHub actions, but not locally
    // t.sendText(' '); // Maybe a bug/glitch in the node-terminal-emulator?
    expect(t.text).toStrictEqual([
      '',
      '↑ [ ] option 5',
      '| [ ] option 6',
      '| [X] option 7',
      '| [ ] option 8',
      '| [ ] option 9',
      '| [ ] option 10' // current selected
    ]);

    t.sendText(' ');
    expect(t.text).toStrictEqual([
      '',
      '↑ [ ] option 5',
      '| [ ] option 6',
      '| [X] option 7',
      '| [ ] option 8',
      '| [ ] option 9',
      '| [X] option 10' // current selected
    ]);

    t.sendText(' ');
    // Edge case of pressing down on the last item
    t.sendKey('down');
    t.sendKey('down');
    t.sendKey('down');
    expect(t.text).toStrictEqual([
      '',
      '↑ [ ] option 5',
      '| [ ] option 6',
      '| [X] option 7',
      '| [ ] option 8',
      '| [ ] option 9',
      '| [ ] option 10' // current selected
    ]);

    t.sendKey('enter');
  });
});
