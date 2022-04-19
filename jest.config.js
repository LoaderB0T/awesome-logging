/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  roots: ['./test'],
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      // ts-jest configuration goes here and your IDE will suggest which configs when typing
      tsconfig: './test/tsconfig.json',
      useESM: true
    }
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  reporters: ['default', ['jest-junit', { outputName: 'junit.xml' }]]
};
