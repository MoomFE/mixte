import process from 'node:process';
import { resolve } from 'pathe';
import Unocss from 'unocss/vite';
import { defineWorkspace } from 'vitest/config';

const showBrowserUI = process.env.Browser_UI === 'true';

export default defineWorkspace([
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
]);
