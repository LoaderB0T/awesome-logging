import ngneers from '@ngneers/eslint-config';

export default [
  {
    ignores: ['test/**/*', '**/jest.config.ts', 'eslint.config.mjs'],
  },
  ...ngneers,
  {
    rules: {
      'switch-colon-spacing': 'warn',
    },
  },
];
