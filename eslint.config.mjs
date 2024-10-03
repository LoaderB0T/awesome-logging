import awdwareNode from '@awdware/eslint-config-nodejs';

export default [
  {
    ignores: ['test/**/*', '**/jest.config.ts', 'eslint.config.mjs'],
  },
  ...awdwareNode,
  {
    rules: {
      'switch-colon-spacing': 'warn',
    },
  },
];
