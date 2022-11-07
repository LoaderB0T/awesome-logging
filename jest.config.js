/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  roots: ['./test'],
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './test/tsconfig.json',
        useESM: true
      }
    ]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  reporters: ['default', ['jest-junit', { outputName: 'junit.xml' }]]
};
