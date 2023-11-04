import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  roots: ['./test'],
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  reporters: ['default', ['jest-junit', { outputName: 'junit.xml' }]],
};

export default config;
