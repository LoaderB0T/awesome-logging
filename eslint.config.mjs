import awdwareNode from '@awdware/eslint-config-nodejs';

export default [
  {
    ignores: ['test/**/*', '**/jest.config.ts', 'eslint.config.mjs'],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js', '*.mjs'],
          defaultProject: true,
        },
        tsconfigRootDir: import.meta.name,
        allowDefaultProject: true,
      },
    },
  },
  ...awdwareNode,
  {
    rules: {
      'switch-colon-spacing': 'warn',
    },
  },
];
