import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const isTestBuild = mode === 'test-build';
  const packagesDir = resolve(__dirname, 'packages');

  return {
    resolve: {
      alias: {
        'mixte': resolve(packagesDir, isTestBuild ? 'mixte/dist/index' : 'mixte/index'),
        '@mixte/use/vite': resolve(packagesDir, isTestBuild ? 'use/dist/vite' : 'use/vite'),
        '@mixte/use': resolve(packagesDir, isTestBuild ? 'use/dist/index' : 'use/index'),
      },
    },
    test: {
      globals: true,
      coverage: {
        provider: 'v8',
      },
    },
  };
});
