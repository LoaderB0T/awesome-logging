/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ['./test'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      // ts-jest configuration goes here and your IDE will suggest which configs when typing
      tsconfig: './test/tsconfig.json'
    }
  },
  reporters: ['default', ['jest-junit', { outputName: 'junit.xml' }]]
};
