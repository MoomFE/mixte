import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import isInCi from 'is-in-ci';
import { alias, testAlias } from './meta/alias';
import VitePlugins from './packages/.vitepress/vite.common.plugins';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const isTestBuild = mode === 'test-build';

  return {
    resolve: {
      alias: [
        ...isTestBuild ? testAlias : alias,
        { find: '@@', replacement: __dirname },
      ],
    },
    define: {
      __TEST_BUILD__: isTestBuild,
    },
    plugins: [
      Vue(),
      VueJsx(),
      ...VitePlugins,
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        enabled: true,
        provider: 'v8',
        all: false,
        exclude: [
          'meta/packages.ts',
          'packages/mixte/src/is/testTypes.ts',
          ...(isInCi ? ['packages/snippets/src/getFastestCDN/**/*'] : []),
        ],
      },
    },
  };
});
