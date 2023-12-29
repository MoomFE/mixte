import { defineConfig } from 'vitest/config';
import { alias, testAlias } from './meta/alias';
import VitePlugins from './packages/.vitepress/vite.common.plugins';

export default defineConfig(({ mode }) => {
  const isTestBuild = mode === 'test-build';

  return {
    resolve: {
      alias: isTestBuild ? testAlias : alias,
    },
    plugins: [
      ...VitePlugins,
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
        include: ['packages/*/src/*/index.ts'],
      },
    },
  };
});
