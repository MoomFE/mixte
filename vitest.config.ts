import process from 'node:process';
import { fileURLToPath } from 'node:url';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import isInCi from 'is-in-ci';
import { dirname, resolve } from 'pathe';
import Unocss from 'unocss/vite';
import { defineConfig } from 'vitest/config';
import { alias, testAlias } from './meta/alias';
import VitePlugins from './packages/.vitepress/vite.common.plugins';

const showBrowserUI = process.env.Browser_UI === 'true';

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
          'packages/mixte/src/is/testTypes.ts',
          ...(isInCi ? ['packages/snippets/src/getFastestCDN/**/*'] : []),
        ],
      },
      exclude: [
        '**/node_modules',
      ],
      projects: [
        {
          extends: './vitest.config.ts',
          test: {
            name: 'test',
            include: [
              '**/*.{test,spec}.{ts,tsx}',
            ],
            exclude: [
              '**/*.browser.{test,spec}.{ts,tsx}',
            ],
          },
        },
        {
          extends: './vitest.config.ts',
          plugins: [
            Unocss({
              configFile: resolve(__dirname, './packages/unocss.config.ts'),
            }),
          ],
          test: {
            name: 'browser',
            browser: {
              enabled: true,
              provider: 'playwright',
              headless: !showBrowserUI,
              instances: [{
                browser: 'chromium',
              }],
            },
            include: [
              '**/*.browser.{test,spec}.{ts,tsx}',
            ],
          },
        },
      ],
    },
  };
});
