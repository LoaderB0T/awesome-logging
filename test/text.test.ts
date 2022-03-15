import { Terminal } from 'node-terminal-simulator';
import { AwesomeLogger } from '../src/index';
import { Stdout } from '../src/render/stdout';
import { TestInit } from './reset';

describe('Text Logger', () => {
  let t: Terminal;

  beforeEach(() => {
    t = TestInit.getTerminal();
  });

  afterEach(() => {
    t.restoreStdout(Stdout.getInstance());
  });

  test('log text', () => {
    AwesomeLogger.log('hello');
    expect(t.allLines).toStrictEqual(['', 'hello']);
    AwesomeLogger.log('line 2');
    expect(t.allLines).toStrictEqual(['', 'hello', 'line 2']);
    AwesomeLogger.log('line 3\nline 4');
    expect(t.allLines).toStrictEqual(['', 'hello', 'line 2', 'line 3', 'line 4']);
  });

  test('log many lines', () => {
    AwesomeLogger.log('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15');
    expect(t.allLines).toStrictEqual(['', '| 1', '| 2', '| 3', '| 4', '| 5', '↓ 6']);
    AwesomeLogger.log('next text');
    expect(t.allLines).toStrictEqual([
      '',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      'next text'
    ]);
  });

  test('overwrite text', () => {
    const c = AwesomeLogger.log('hello');
    expect(t.allLines).toStrictEqual(['', 'hello']);
    c.setText('overwrite');
    expect(t.allLines).toStrictEqual(['', 'overwrite']);
    c.setText('multi\nline\noverwrite');
    expect(t.allLines).toStrictEqual(['', 'multi', 'line', 'overwrite']);
    c.setText('back to one line');
    expect(t.allLines).toStrictEqual(['', 'back to one line']);
  });
});
