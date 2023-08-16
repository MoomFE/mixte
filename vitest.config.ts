import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const isTestBuild = mode === 'test-build';
  const testBuildAlias = {
    'mixte': resolve(__dirname, './packages/mixte/dist/index'),
    '@mixte/use/register': resolve(__dirname, './packages/use/dist/register'),
    '@mixte/use': resolve(__dirname, './packages/use/dist/index'),
  };

  return {
    resolve: {
      alias: isTestBuild ? testBuildAlias : {},
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
