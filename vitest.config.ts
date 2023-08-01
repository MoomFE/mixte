import { defineConfig } from 'vitest/config';
import { alias, testAlias } from './meta/alias';

export default defineConfig(({ mode }) => {
  const isTestBuild = mode === 'test-build';

  return {
    resolve: {
      alias: isTestBuild ? testAlias : alias,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
      },
    },
  };
});
