import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Alias } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const alias: Alias[] = [
  { find: 'mixte', replacement: resolve(__dirname, '../packages/mixte/index') },
  { find: '@mixte/use/register', replacement: resolve(__dirname, '../packages/use/src/register') },
  { find: '@mixte/use', replacement: resolve(__dirname, '../packages/use/index') },
  { find: /^@mixte\/components\/(.*)$/, replacement: resolve(__dirname, '../packages/components/src/$1/index') },
  { find: '@mixte/components', replacement: resolve(__dirname, '../packages/components/index') },
  { find: '@mixte/validator', replacement: resolve(__dirname, '../packages/validator/index') },
  { find: /^@mixte\/snippets\/(.*)$/, replacement: resolve(__dirname, '../packages/snippets/src/$1/index') },
];

export const testAlias: Alias[] = [
  { find: 'mixte', replacement: resolve(__dirname, '../packages/mixte/dist/index') },
  { find: '@mixte/use/register', replacement: resolve(__dirname, '../packages/use/dist/register') },
  { find: '@mixte/use', replacement: resolve(__dirname, '../packages/use/dist/index') },
  { find: /^@mixte\/components\/(.*)$/, replacement: resolve(__dirname, '../packages/components/dist/$1') },
  { find: '@mixte/components', replacement: resolve(__dirname, '../packages/components/dist/index') },
  { find: '@mixte/validator', replacement: resolve(__dirname, '../packages/validator/dist/index') },
  { find: /^@mixte\/snippets\/(.*)$/, replacement: resolve(__dirname, '../packages/snippets/dist/$1') },
];
