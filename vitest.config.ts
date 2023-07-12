import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const isTestBuild = mode === 'test-build';
  const packagesDir = resolve(__dirname, 'packages');

  return {
    resolve: {
      alias: {
        'mixte': resolve(packagesDir, isTestBuild ? 'mixte/dist/index' : 'mixte/index'),
        '@mixte/use/register': resolve(packagesDir, isTestBuild ? 'use/dist/register' : 'use/register'),
        '@mixte/use': resolve(packagesDir, isTestBuild ? 'use/dist/index' : 'use/index'),
      },
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
