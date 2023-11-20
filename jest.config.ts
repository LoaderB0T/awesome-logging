import type { JestConfigWithTsJest } from 'ts-jest';
import { defaultsESM } from 'ts-jest/presets';

// Changes the tsconfig used for tests to tsconfig.spec.json
const transform = defaultsESM.transform!;
Object.keys(transform).forEach(key => {
  const value = transform[key];
  if (Array.isArray(value)) {
    value[1].tsconfig = './tsconfig.spec.json';
  }
});

const config: JestConfigWithTsJest = {
  roots: ['./test'],
  transform: {
    ...transform,
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  reporters: ['default', ['jest-junit', { outputName: 'junit.xml' }]],
};

export default config;
