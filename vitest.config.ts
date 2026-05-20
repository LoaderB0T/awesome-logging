import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: '.',
    include: ['test/**/*.spec.ts'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: 'junit.xml',
    },
  },
});
